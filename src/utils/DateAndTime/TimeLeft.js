export default function convertMiliSec(milisec) {
  const milisecADay = 86400000;
  milisec = milisecADay - (new Date().getTime() - milisec);
  const h = parseInt(milisec / 3600000).toFixed(0);
  const m = parseInt((milisec - h * 3600000) / 60000).toFixed(0);
  const hourFormat = h <= 9 ? "0" + h : "" + h;
  const minFormat = m <= 9 ? "0" + m : "" + m;
  return hourFormat + ":" + minFormat;
}
