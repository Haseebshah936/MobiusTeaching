export default (date) => {
  const dateInFormat = new Date(date);
  const day =
    dateInFormat.getDate() > 9
      ? dateInFormat.getDate()
      : "0" + dateInFormat.getDate();
  const m = dateInFormat.getMonth() + 1;
  const month = m > 9 ? m : "0" + m;
  const formatedDate = day + "-" + month + "-" + dateInFormat.getFullYear();

  return formatedDate;
};
