export default (teeTime) => {
  const time = teeTime.split(":");
  time[0] = parseInt(time[0]);
  time[1] = parseInt(time[1]);
  if (time[1] < 10) {
    time[1] = "0" + time[1];
  }
  time[0] =
    time[0] > 11
      ? time[0] == 12
        ? 12 + ":" + time[1] + " pm"
        : time[0] % 12 < 10
        ? "0" + (time[0] % 12) + ":" + time[1] + " pm"
        : (time[0] % 12) + ":" + time[1] + " pm"
      : time[0] > 9
      ? time.join(":") + " am"
      : "0" + time.join(":") + " am";
  return time[0];
};
