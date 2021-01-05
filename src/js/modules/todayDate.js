let today = new Date();
// convert to msec since Jan 1 1970
const localTime = today.getTime();

// obtain local UTC offset and convert to msec
const minutesToMilliseconds = 60 * 1000;
const localOffset = today.getTimezoneOffset() * minutesToMilliseconds;

// obtain UTC time in msec
const utc = localTime + localOffset;

// obtain and add destination's UTC time offset
// for example, Eastern Time
// which is UTC - 4 hours
const offset = 4;
const hoursToMilliseconds = 3600 * 1000;
const easternTime = utc - hoursToMilliseconds * offset;

// convert msec value to date string
today = new Date(easternTime);

let yesterday = new Date(today);
// Set the day and hour for yesterday
yesterday.setDate(today.getDate() - 1);
yesterday.setHours(today.getHours() - offset);

// format yesterday to yyyymmdd format
yesterday = yesterday.toISOString();
yesterday = yesterday.substring(0, 10).replace(/-/g, "");

// today's date if we need it
today = today.toISOString();
today = today.substring(0, 10).replace(/-/g, "");

// Year
let year = today;
year = year.substring(0, 4);
let month = today.substring(4, 6);
let lastYear = year - 1;

module.exports.yesterday = yesterday;
module.exports.today = today;
module.exports.month = month;
module.exports.year = year;
module.exports.lastYear = lastYear;
