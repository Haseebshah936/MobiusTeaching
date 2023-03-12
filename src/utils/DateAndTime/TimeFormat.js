export const timeFormat = (hour, min) => {
  //   time = time.split(":");
  //   let hour = time[0];
  //   let min = time[1];
  hour = hour <= 9 ? "0" + hour : hour;
  min = min <= 9 ? "0" + min : min;
  return hour + ":" + min;
};
