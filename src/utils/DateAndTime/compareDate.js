function compareDate(date) {
  const oneMinute = 60 * 1000; // milliseconds in an hour
  const oneHour = 60 * 60 * 1000; // milliseconds in an hour
  const oneDay = 24 * oneHour; // milliseconds in a day
  const oneWeek = 7 * oneDay; // milliseconds in a week
  const oneMonth = 30 * oneDay; // milliseconds in a month
  const oneYear = 365 * oneDay; // milliseconds in a year

  const currentDate = new Date(); // current date
  const diff = currentDate - date; // time difference in milliseconds

  if (diff < oneMinute) {
    return Math.round(diff / 1000) + " sec ago";
  }
  if (diff < oneHour) {
    return Math.round(diff / (60 * 1000)) + " min ago";
  } else if (diff < oneDay) {
    return new Date(date).toLocaleTimeString(["en-US"], {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  } else if (diff < oneDay * 2) {
    return "Yesterday";
  } else if (diff < oneWeek) {
    return Math.round(diff / oneDay) + " days ago";
  } else if (diff < 2 * oneWeek) {
    return "Last week";
  } else if (diff < oneMonth) {
    return Math.round(diff / oneWeek) + " weeks ago";
  } else if (diff < oneYear) {
    return Math.round(diff / oneMonth) + " months ago";
  } else {
    return Math.round(diff / oneYear) + " years ago";
  }
}

export default compareDate;
