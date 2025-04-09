// Yellow sticky note

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let currentDate = new Date();
let dateString = `${currentDate.getDate()}`;
let monthString = `${months[currentDate.getMonth()]}`;

document.getElementById("morf-date").textContent = dateString;
document.getElementById("morf-month").textContent = monthString;
