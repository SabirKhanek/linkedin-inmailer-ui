export function formatDateTime(date: Date | string): string {
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  if (typeof date === "string") date = new Date(date);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  let hour = date.getHours();
  const minute = date.getMinutes();
  const period = hour >= 12 ? "PM" : "AM";

  // Convert 24-hour format to 12-hour format
  hour = hour % 12 || 12;

  return `${day} ${month}, ${year} ${hour}:${minute
    .toString()
    .padStart(2, "0")} ${period}`;
}
