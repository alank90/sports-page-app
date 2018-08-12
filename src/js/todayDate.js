let today = new Date();
let yesterday = new Date(today);

yesterday.setDate(today.getDate() - 1);

// format yesterday to yyyymmdd format
yesterday = yesterday.toISOString();
yesterday = yesterday.substring(0, 10).replace(/-/g, "");

// today's date if we need it
today = today.toISOString();
today = today.substring(0, 10).replace(/-/g, "");


module.exports.yesterday = yesterday;
// module.exports.today = today;
