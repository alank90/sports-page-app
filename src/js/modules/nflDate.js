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
let thursdayDate = new Date(easternTime);
let sundayDate = new Date(easternTime);
let mondayDate = new Date(easternTime);

// Get Day of Week (0-6)
let dayOfWeek = nflDay.getDay();

// Calculate back to appropriate Thursday
if (dayOfWeek === 4) {
  // it's Thursday go back one week
  thursdayDate.setDate(thursdayDate.getDate() - 7);
  // format yesterday to yyyymmdd format
  thursdayDate = thursdayDate.toISOString();
  thursdayDate = thursdayDate.substring(0, 10).replace(/-/g, "");
} else if (dayOfWeek >= 0 && dayOfWeek < 4) {
  // Set thursdayDate to appropriate prior Thursday for Sun thru Wed
  thursdayDate.setDate(thursdayDate.getDate() - (dayOfWeek + 3));
  // format yesterday to yyyymmdd format
  thursdayDate = thursdayDate.toISOString();
  thursdayDate = thursdayDate.substring(0, 10).replace(/-/g, "");
} else if (dayOfWeek >= 5 && dayOfWeek < 7) {
  // Set thursdayDate to appropriate prior Thursday for Fri & Sat
  thursdayDate.setDate(thursdayDate.getDate() - (dayOfWeek - 4));
  // format yesterday to yyyymmdd format
  thursdayDate = thursdayDate.toISOString();
  thursdayDate = thursdayDate.substring(0, 10).replace(/-/g, "");
} else {
  console.log(`Variable dayOfWeek out of Bounds!`);
  console.log(dayOfWeek);
}
// =========== End Thursday Calculation =============== //

// ======= Calculate back to appropriate Sunday ========= //
if (dayOfWeek === 0) {
  // it's Sunday. go back one week
  sundayDate.setDate(sundayDate.getDate() - 7);
  // format yesterday to yyyymmdd format
  sundayDate = sundayDate.toISOString();
  sundayDate = sundayDate.substring(0, 10).replace(/-/g, "");
} else if (dayOfWeek < 7) {
  // Set the day sundayDate to appropriate prior Sunday
  sundayDate.setDate(sundayDate.getDate() - dayOfWeek);
  // format yesterday to yyyymmdd format
  sundayDate = sundayDate.toISOString();
  sundayDate = sundayDate.substring(0, 10).replace(/-/g, "");
} else {
  console.log(`Variable dayOfWeek out of Bounds!`);
  console.log(dayOfWeek);
}
// =========== End Sunday Calculation =============== //

// ============ Calculate back to appropriate Monday ========== //
if (dayOfWeek === 1) {
  // it's Monday go back one week
  mondayDate.setDate(mondayDate.getDate() - 7);
  // format mondayDate to yyyymmdd format
  mondayDate = mondayDate.toISOString();
  mondayDate = mondayDate.substring(0, 10).replace(/-/g, "");
} else if (dayOfWeek >= 2 && dayOfWeek <= 6) {
  // Set mondayDate to appropriate prior Monday for Tu thru Sat
  mondayDate.setDate(mondayDate.getDate() - (dayOfWeek - 1));
  // format mondayDate to yyyymmdd format
  mondayDate = mondayDate.toISOString();
  mondayDate = mondayDate.substring(0, 10).replace(/-/g, "");
} else if (dayOfWeek === 0) {
  // Set mondayDate to appropriate prior Sun
  mondayDate.setDate(mondayDate.getDate() - 6);
  // format mondayDate to yyyymmdd format
  mondayDate = mondayDate.toISOString();
  mondayDate = mondayDate.substring(0, 10).replace(/-/g, "");
} else {
  console.log(`Variable dayOfWeek out of Bounds!`);
  console.log(dayOfWeek);
}
// =========== End Monday Calculation =============== //

module.exports = {
  thursdayDate: thursdayDate,
  sundayDate: sundayDate,
  mondayDate: mondayDate
};
