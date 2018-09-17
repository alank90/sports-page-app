let nflDay = new Date();
// convert to msec since Jan 1 1970
const localTime = nflDay.getTime();

// obtain local UTC offset and convert to msec
const minutesToMilliseconds = 60 * 1000;
const localOffset = nflDay.getTimezoneOffset() * minutesToMilliseconds;

// obtain UTC time in msec
const utc = localTime + localOffset;

// obtain and add destination's UTC time offset
// for example, Eastern Time
// which is UTC - 4 hours
const offset = 4;
const hoursToMilliseconds = 3600 * 1000;
const easternTime = utc - hoursToMilliseconds * offset;

// convert msec value to date string
nflThursdayDate = new Date(easternTime);
nflSundayDate = new Date(easternTime);

// Get Day of Week (0-6)
let dayOfWeek = nflDay.getDay();

// Calculate back to appropriate Thursday
if (dayOfWeek === 4) {
  // it's Thursday go back one week
  nflThursdayDate.setDate(nflThursdayDate.getDate() - 7);
  // format yesterday to yyyymmdd format
  nflThursdayDate = nflThursdayDate.toISOString();
  nflThursdayDate = nflThursdayDate.substring(0, 10).replace(/-/g, "");
} else if (dayOfWeek >= 0 && dayOfWeek < 4) {
  // Set nflThursdayDate to appropriate prior Thursday for Sun thru Wed
  nflThursdayDate.setDate(nflThursdayDate.getDate() - (dayOfWeek + 3));
  // format yesterday to yyyymmdd format
  nflThursdayDate = nflThursdayDate.toISOString();
  nflThursdayDate = nflThursdayDate.substring(0, 10).replace(/-/g, "");
} else if (dayOfWeek >= 5 && dayOfWeek < 7) {
  // Set nflThursdayDate to appropriate prior Thursday for Fri & Sat
  nflThursdayDate.setDate(nflThursdayDate.getDate() - (dayOfWeek - 4));
  // format yesterday to yyyymmdd format
  nflThursdayDate = nflThursdayDate.toISOString();
  nflThursdayDate = nflThursdayDate.substring(0, 10).replace(/-/g, "");
} else {
  console.log(`Variable dayOfWeek out of Bounds!`);
  console.log(dayOfWeek);
}
// =========== End Thursday Calculation =============== //

// Calculate back to appropriate Sunday
if (dayOfWeek === 0) {
  // it's Sunday. go back one week
  nflSundayDate.setDate(nflSundayDate.getDate() - 7);
  // format yesterday to yyyymmdd format
  nflSundayDate = nflSundayDate.toISOString();
  nflSundayDate = nflSundayDate.substring(0, 10).replace(/-/g, "");
} else if (dayOfWeek < 7) {
  // Set the day nflSundayDate to appropriate prior Sunday
  nflSundayDate.setDate(nflSundayDate.getDate() - dayOfWeek);
  // format yesterday to yyyymmdd format
  nflSundayDate = nflSundayDate.toISOString();
  nflSundayDate = nflSundayDate.substring(0, 10).replace(/-/g, "");
} else {
  console.log(`Variable dayOfWeek out of Bounds!`);
  console.log(dayOfWeek);
}
// =========== End Sunday Calculation =============== //

module.exports = {
  nflThursdayDate: nflThursdayDate,
  nflSundayDate: nflSundayDate
};
