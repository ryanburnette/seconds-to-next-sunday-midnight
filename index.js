'use strict';

const { DateTimeFormat } = Intl;

/**
 * Converts a short weekday string to its corresponding index.
 *
 * @param {string} weekday - Short weekday string (e.g., 'Sun', 'Mon').
 * @returns {number} - Index of the weekday (0 = Sunday, ..., 6 = Saturday).
 */
function getWeekdayIndex(weekday) {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return weekdays.indexOf(weekday);
}

/**
 * Gets the time zone offset in minutes for a given UTC date and time zone.
 *
 * @param {Date} utcDate - The UTC date object.
 * @param {string} timeZone - The IANA time zone identifier.
 * @returns {number} - Offset in minutes from UTC.
 */
function getOffset(utcDate, timeZone) {
  const formatter = new DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const parts = formatter.formatToParts(utcDate);
  const map = {};
  parts.forEach((part) => {
    if (part.type !== 'literal') {
      map[part.type] = part.value;
    }
  });

  // Create a Date object from the time zone's local time, treating it as UTC
  const localDate = new Date(
    Date.UTC(
      parseInt(map.year, 10),
      parseInt(map.month, 10) - 1,
      parseInt(map.day, 10),
      parseInt(map.hour, 10),
      parseInt(map.minute, 10),
      parseInt(map.second, 10)
    )
  );

  // Calculate the offset in minutes
  const offset = (localDate.getTime() - utcDate.getTime()) / 60000;

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
  // Formatter to get the current weekday in the specified time zone
  const weekdayFormatter = new DateTimeFormat('en-US', {
    timeZone: timeZone,
    weekday: 'short',
  });

  const weekdayStr = weekdayFormatter.format(localeDate);
  const currentWeekday = getWeekdayIndex(weekdayStr);

  // Calculate days until next Sunday
  let daysUntilSunday = (7 - currentWeekday) % 7;
  if (daysUntilSunday === 0) {
    daysUntilSunday = 7;
  }

  // Compute the target date by adding daysUntilSunday days
  const targetDate = new Date(
    localeDate.getTime() + daysUntilSunday * 86400 * 1000
  );

  // Formatter to extract year, month, and day in the specified time zone
  const dateFormatter = new DateTimeFormat('en-US', {
    timeZone: timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const dateParts = dateFormatter.formatToParts(targetDate);
  const dateMap = {};
  dateParts.forEach((part) => {
    if (part.type !== 'literal') {
      dateMap[part.type] = part.value;
    }
  });

  const targetYear = parseInt(dateMap.year, 10);
  const targetMonth = parseInt(dateMap.month, 10);
  const targetDay = parseInt(dateMap.day, 10);

  // Create a UTC Date object for midnight of the target date in the time zone
  const targetMidnightUTC = new Date(
    Date.UTC(targetYear, targetMonth - 1, targetDay, 0, 0, 0)
  );

  // Get the time zone offset at the target midnight
  const offset = getOffset(targetMidnightUTC, timeZone); // in minutes

  // Compute the UTC timestamp for the target midnight in the time zone
  const targetUTCTimestamp = targetMidnightUTC.getTime() - offset * 60000;

  // Calculate the difference in seconds
  const diffInSeconds = Math.floor(
    (targetUTCTimestamp - localeDate.getTime()) / 1000
  );

  return diffInSeconds;
}

module.exports = secondsToNextSundayMidnight;
