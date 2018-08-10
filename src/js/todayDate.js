let dateUnformatted = new Date();
let currentDate = dateUnformatted.toISOString();
currentDate = currentDate.substring(0, 10).replace(/-/g, "");

module.exports = currentDate;
