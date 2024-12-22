'use strict';

const { DateTimeFormat } = Intl;

/**
 * Converts short weekday string to index.
 *
 * @param {string} weekday - Short weekday string (e.g., 'Sun', 'Mon').
 * @returns {number} - Index of the weekday (0 = Sunday, ..., 6 = Saturday).
 */
function getWeekdayIndex(weekday) {
  var weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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

/**
 * Gets the time zone offset in minutes for a given date and time zone.
 *
 * @param {Date} date - The date object.
 * @param {string} timeZone - The IANA time zone identifier.
 * @returns {number} - Offset in minutes from UTC.
 */
function getOffset(date, timeZone) {
  var dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  var parts = dtf.formatToParts(date);
  var map = {};
  parts.forEach(function (part) {
    if (part.type !== 'literal') {
      map[part.type] = part.value;
    }
  });
  // Create a Date object from the target time zone's local time
  var targetLocalDate = new Date(
    `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}:${map.second}Z`
  );
  // Calculate the offset in minutes
  var offset = (targetLocalDate.getTime() - date.getTime()) / 60000;
  return offset;
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
  var formatter = new DateTimeFormat('en-US', {
    timeZone: timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  // Extract parts
  var parts = formatter.formatToParts(localeDate);
  var dateParts = {};
  parts.forEach(function (part) {
    if (part.type !== 'literal') {
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

  // Calculate the target local date for next Sunday
  var targetYear = parseInt(dateParts.year);
  var targetMonth = parseInt(dateParts.month);
  var targetDay = parseInt(dateParts.day) + daysUntilSunday;

  // Handle month overflow
  var targetDate = new Date(
    Date.UTC(targetYear, targetMonth - 1, targetDay, 0, 0, 0)
  );

  // Get the offset in minutes between UTC and target time zone at targetDate
  var targetOffset = getOffset(targetDate, timeZone);

  // Calculate the UTC timestamp for next Sunday midnight in target time zone
  var targetUTCTimestamp = targetDate.getTime() - targetOffset * 60000;

  // Calculate the difference in seconds
  var diffInSeconds = Math.floor(
    (targetUTCTimestamp - localeDate.getTime()) / 1000
  );

  return diffInSeconds;
}

module.exports = secondsToNextSundayMidnight;
