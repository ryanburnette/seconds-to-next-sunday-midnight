// index.js

const { DateTimeFormat } = Intl;

/**
 * Converts a local date and time in a specific time zone to a UTC timestamp.
 *
 * @param {number} year - The year component.
 * @param {number} month - The month component (1-12).
 * @param {number} day - The day component.
 * @param {string} timeZone - The IANA time zone identifier.
 * @returns {number} - UTC timestamp in milliseconds.
 */
function getUTCDate(year, month, day, timeZone) {
  // Create a DateTimeFormat object for the target time zone
  var formatter = new DateTimeFormat("en-US", {
    timeZone: timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  // Format the target date components
  var parts = formatter.formatToParts(
    new Date(Date.UTC(year, month - 1, day, 0, 0, 0))
  );
  var map = {};
  parts.forEach(function (part) {
    if (part.type !== "literal") {
      map[part.type] = part.value;
    }
  });

  // Create a Date object assuming the components are in the target time zone
  var targetDate = new Date(
    Date.UTC(
      parseInt(map.year),
      parseInt(map.month) - 1,
      parseInt(map.day),
      parseInt(map.hour),
      parseInt(map.minute),
      parseInt(map.second)
    )
  );

  return targetDate.getTime();
}

/**
 * Calculates the number of seconds until the next Sunday at midnight
 * based on the provided localeDate and timeZone.
 *
 * @param {Date} localeDate - The reference date.
 * @param {string} timeZone - The IANA time zone identifier.
 * @returns {number} - Seconds until next Sunday midnight.
 */
function secondsToNextSundayMidnight(localeDate, timeZone) {
  // Formatter to get the components in the specified time zone
  var formatter = new DateTimeFormat("en-US", {
    timeZone: timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  // Extract parts
  var parts = formatter.formatToParts(localeDate);
  var dateParts = {};
  parts.forEach(function (part) {
    if (part.type !== "literal") {
      dateParts[part.type] = part.value;
    }
  });

  // Get current weekday (0 = Sunday, 6 = Saturday)
  var currentWeekday = getWeekdayIndex(dateParts.weekday);

  // Calculate days until next Sunday
  var daysUntilSunday = (7 - currentWeekday) % 7;
  if (daysUntilSunday === 0 && isAfterMidnight(dateParts)) {
    daysUntilSunday = 7;
  }

  // Calculate the next Sunday date in the target time zone
  var targetYear = parseInt(dateParts.year);
  var targetMonth = parseInt(dateParts.month);
  var targetDay = parseInt(dateParts.day) + daysUntilSunday;

  // Get the UTC timestamp for next Sunday midnight in the target time zone
  var targetUTCTimestamp = getUTCDate(
    targetYear,
    targetMonth,
    targetDay,
    timeZone
  );

  // Calculate the difference in seconds
  var diffInSeconds = Math.floor(
    (targetUTCTimestamp - localeDate.getTime()) / 1000
  );

  return diffInSeconds;
}

/**
 * Converts short weekday string to index.
 *
 * @param {string} weekday - Short weekday string (e.g., 'Sun', 'Mon').
 * @returns {number} - Index of the weekday (0 = Sunday, ..., 6 = Saturday).
 */
function getWeekdayIndex(weekday) {
  var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return weekdays.indexOf(weekday);
}

/**
 * Checks if the current time is after midnight.
 *
 * @param {Object} dateParts - Object containing hour, minute, second.
 * @returns {boolean} - True if time is after midnight, else false.
 */
function isAfterMidnight(dateParts) {
  return (
    parseInt(dateParts.hour) > 0 ||
    parseInt(dateParts.minute) > 0 ||
    parseInt(dateParts.second) > 0
  );
}

module.exports = secondsToNextSundayMidnight;
