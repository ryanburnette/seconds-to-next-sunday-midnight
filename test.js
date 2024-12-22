// test.js
const assert = require("assert");
const secondsToNextSundayMidnight = require("./index");

describe("secondsToNextSundayMidnight", function () {
  it("should return the correct number of seconds to next Sunday midnight for a given date and timezone", function () {
    var localeDate = new Date("2024-04-23T10:00:00Z"); // Tuesday
    var timeZone = "UTC";
    var expected = 396000; // 4 days and 14 hours in seconds
    var actual = secondsToNextSundayMidnight(localeDate, timeZone);
    assert.strictEqual(actual, expected);
  });

  it("should return zero when the date is exactly Sunday midnight", function () {
    var localeDate = new Date("2024-04-28T00:00:00Z"); // Sunday midnight
    var timeZone = "UTC";
    var expected = 0;
    var actual = secondsToNextSundayMidnight(localeDate, timeZone);
    assert.strictEqual(actual, expected);
  });

  it("should correctly calculate seconds across different time zones", function () {
    var localeDate = new Date("2024-04-23T10:00:00-04:00"); // Tuesday in EDT
    var timeZone = "America/New_York";
    var expected = 396000; // Adjusted for EDT
    var actual = secondsToNextSundayMidnight(localeDate, timeZone);
    assert.strictEqual(actual, expected);
  });

  it("should handle dates near the end of the year", function () {
    var localeDate = new Date("2024-12-30T23:59:00Z"); // Monday
    var timeZone = "UTC";
    var expected = 51840; // 6 days and 0 minutes in seconds
    var actual = secondsToNextSundayMidnight(localeDate, timeZone);
    assert.strictEqual(actual, expected);
  });
});
