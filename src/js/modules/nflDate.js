// ========== src/js/modules/nfldate.js ================== //

let nflDay = new Date();
// convert to msec since Jan 1 1970

// convert msec value to date string
let thursdayDate = new Date();
let sundayDate = new Date();
let mondayDate = new Date();

// Get Day of Week (0-6)
let dayOfWeek = nflDay.getDay();

// Calculate back to appropriate Thursday
// Need SetUTCDate to offset the .toISOString method from
// converting date back to UTC time.
if (dayOfWeek === 4) {
  // it's Thursday go back one week
  thursdayDate.setUTCDate(thursdayDate.getDate() - 7);
  // format yesterday to yyyymmdd format
  thursdayDate = thursdayDate.toISOString();
  thursdayDate = thursdayDate.substring(0, 10).replace(/-/g, "");
} else if (dayOfWeek >= 0 && dayOfWeek < 4) {
  // Set thursdayDate to appropriate prior Thursday for Sun thru Wed
  thursdayDate.setUTCDate(thursdayDate.getDate() - (dayOfWeek + 3));
  // format yesterday to yyyymmdd format
  thursdayDate = thursdayDate.toISOString();
  thursdayDate = thursdayDate.substring(0, 10).replace(/-/g, "");
} else if (dayOfWeek >= 5 && dayOfWeek < 7) {
  // Set thursdayDate to appropriate prior Thursday for Fri & Sat
  thursdayDate.setUTCDate(thursdayDate.getDate() - (dayOfWeek - 4));

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
  sundayDate.setUTCDate(sundayDate.getDate() - 7);
  // format yesterday to yyyymmdd format
  sundayDate = sundayDate.toISOString();
  sundayDate = sundayDate.substring(0, 10).replace(/-/g, "");
} else if (dayOfWeek < 7) {
  // Set the day sundayDate to appropriate prior Sunday
  sundayDate.setUTCDate(sundayDate.getDate() - dayOfWeek);

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
  mondayDate.setUTCDate(mondayDate.getDate() - 7);
  // format mondayDate to yyyymmdd format
  mondayDate = mondayDate.toISOString();
  mondayDate = mondayDate.substring(0, 10).replace(/-/g, "");
} else if (dayOfWeek >= 2 && dayOfWeek <= 6) {
  // Set mondayDate to appropriate prior Monday for Tu thru Sat
  mondayDate.setUTCDate(mondayDate.getDate() - (dayOfWeek - 1));
  // format mondayDate to yyyymmdd format
  mondayDate = mondayDate.toISOString();
  mondayDate = mondayDate.substring(0, 10).replace(/-/g, "");
} else if (dayOfWeek === 0) {
  // Set mondayDate to appropriate prior Sun
  mondayDate.setUTCDate(mondayDate.getDate() - 6);
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
