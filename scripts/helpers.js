import { month_tr } from "./constants.js";
//Bugünün tarihini gün ay_ismi cinsinden geri döndürür
export const getDate = () =>{
    const date = new Date();
    const day = date.getDate();
    const monthIndex = date.getMonth();
  
    return day + ' ' + month_tr[monthIndex];
  };