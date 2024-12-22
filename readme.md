# seconds-to-next-sunday-midnight

`seconds-to-next-sunday-midnight` is a JavaScript library to calculate the number of seconds until the next Sunday at midnight based on a given date and time zone.

## Usage

```javascript
const secondsToNextSundayMidnight = require('seconds-to-next-sunday-midnight');

const localeDate = new Date('2024-04-23T10:00:00Z');
const timeZone = 'UTC';
const seconds = secondsToNextSundayMidnight(localeDate, timeZone);

console.log(seconds); // Outputs: 396000
```

## Testing

```bash
npm test
```

