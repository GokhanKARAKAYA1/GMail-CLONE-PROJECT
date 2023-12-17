import { ele, renderMails, toggleModal } from "./scripts/ui.js";
import { getDate } from "./scripts/helpers.js";

//*)Local Storaga'dan verileri al ve object formatına çevir
//Projede mail verisi olarak hep bunu kullan diziyi güncellediğinde local
//local storege da güncelle
const strMail = localStorage.getItem("mails") || [];
let mailData = JSON.parse(strMail);

//1-Navbar için açılma ve kapanma özelliği
// Hamburger menüsüne tıklanma olayını  izle
//Tıklanınca Nav Menüsüne Hide Class'ı ekle
//Kapalıyken ise Hide Class'ını kaldır/gizle
ele.menu.addEventListener("click", () => {
  ele.nav.classList.toggle("hide");
});
// 2) Listeleme Özelliği
// Kullanıcının Projeye Girme Anında Mailleri Listele
// DOMContentLoaded > tarayıcıdaki hmtl'in yüklenmesi bitince çalışır
//Ekran boyutu 1200 px altında ise navbar kapalı gelsin
document.addEventListener("DOMContentLoaded", () => {
  renderMails(mailData);
  if (window.innerWidth < 1200) {
    ele.nav.classList.add("hide");
  }
});

// 3) Modal Açma Kapama Özelliği
// Oluştur butonuna tıklanınca modal'ı göster
// x butonuna veya dış kısma tıklanınca modal'ı kapat (display:none)
ele.createBtn.addEventListener("click", () => toggleModal(true));
ele.closeBtn.addEventListener("click", () => toggleModal(false));
ele.modal.addEventListener("click", (e) => {
  //Eğerki tıklanılan elemanın class'ında modal-wrapper varsa
  if (e.target.classList.contains("modal-wrapper")) {
    toggleModal(false);
  }
});

//4) Mail Atma Özelliği
//Açılan modaldaki formun gönderilme olayını izleyecez
//eğer bütün inputlar doluysa yeni mail oluştur
//değilse kullanıcıya uyarı ver

ele.modalForm.addEventListener("submit", (e) => {
  //sayfayı yenilemeyi engelleme
  e.preventDefault();
  //Formdaki inputların verilerine erişme
  const receiver = e.target[1].value;
  const title = e.target[2].value;
  const message = e.target[3].value;
  //Eğer ki inputlar boşsa uyarı gönder
  if (!receiver || !title || !message) {
    alert("Lütfen bütün alanları doldurun");
  } else {
    //Diziye eklemek için mail objesi oluştur
    const newMail = {
      id: new Date().getTime(),
      sender: "Ali",
      receiver: receiver,
      title: title,
      message: message,
      date: getDate(),
    };

    //Yeni maili mailler dizisine ekledik
    mailData.unshift(newMail);

    //Mailler dizisinin son halini local Storega ka kaydettik
    localStorage.setItem("mails", JSON.stringify(mailData));

    //mailler dizisinin son halini ekrana bastık
    renderMails(mailData);

    //modalı kapat
    toggleModal(false);
  }
});

//5) Mail Silme Özelliği
const handleClick = (e) => {
  const mail = e.target.closest(".mail");
  const mailId = mail.dataset.id;
  console.log(mailId, mailData);
  //Tıklanılan elemanın ID si Delete ise maili sil
  if (e.target.id === "delete" && confirm("Maili silmek istiyor musunuz?")) {
    // ID si sileceğimiz elemanlara eşit olmayan elemanları filtrele
    mailData = mailData.filter((mail) => mail.id !== Number(mailId));
    //Local Storega güncelleme
    localStorage.setItem("mails", JSON.stringify(mailData));
    // Mail'i HTML'den kaldır
    mail.remove();
  }
  //Tıklanılan eleman yıldız ise  like'la
  if (e.target.id === "star") {
    //1) id'sini bildiğimiz mail 'in bütün bilgilerini tersine çevir
    const found = mailData.find((item) => item.id === Number(mailId));
    console.log(found);
    //2) mail'in is_stared "yıldızlı" değerini tersine çevir
    found.isStared = !found.isStared;
    //3) local storage ı güncelle
    localStorage.setItem("mails", JSON.stringify(mailData)); //4)arayüzü güncelle
    renderMails(mailData);
  }
};

ele.mailsArea.addEventListener("click", handleClick);

//6)Navigasyon Menüsü Aktifliği
ele.nav.addEventListener("click", (e) => {
  //Eğer ki ikinci kategoriye yani 'yıldızlı' tıklanırsa
  if (e.target.id === "cat2") {
    //Dizi içersinden sadece yıldızlı olanları al ve ekrana yaz
    const filtred = mailData.filter((mail) => mail.isStared === true);
    renderMails(filtred);
  } else {
    //bütün diziyi ekrana bas
    renderMails(mailData);
  }
});

// 7) Aratma Özelliği
// Kullanıcının anlık olarak inputa her veri girdiğinde mailleri
//filtrele
let timer;

ele.searchInp.addEventListener("input", (e) => {
  clearTimeout(timer);
  timer = setTimeout(() => searchMail(e), 400);
});

function searchMail(e) {
  // Arama terimine erişme
  const query = e.target.value;
  console.log("filtreleme yapıldı", query);
  //Mail'in içerisindeki en az bir değer arattığımız terimi
  //içeriyorsa maili filtrele
  //Arama terimi mail başlığı içeren mailleri filtreleme
  const filtred = mailData.filter((mail) =>
    //objeyi diziye çevir
    Object.values(mail) //dizinin ihtiyacımız olan elemenlarını al
      .slice(1, 6) //Objenin değerlerinden en az birisi aradığımız değerleri içeriyor mu?
      .some((value) => value.toLowerCase().includes(query))
  );
  if (filtred.length === 0) {
    ele.mailsArea.innerHTML = `<div class="warn">Arattığınız terime uygun mail bulunamadı</div>`;
  } else {
    //Filtrelenenleri ekrana basma
    renderMails(filtred);
  }
}
