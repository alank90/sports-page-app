// ========== src/js/modules/seasonDates.js ================== //
const date = require("./todayDate");

const mlb = {
  regularSeasonStartDate: "20190328",
  regularSeasonEndDate: "20190929",
  playoffsBeginDate: "20191001",
  playoffsEndDate: "20191101"
};

const nfl = {
  regularSeasonStartDate: "20200910",
  regularSeasonEndDate: "20210103",
  superbowlDate: new Date(2021, 1, 7), // Feb 07 2021
  superbowlOffsetDate: new Date(),
  daysToMilliseconds: 3600 * 24 * 7 * 1000
};

const nba = {
  regularSeasonStartDate: "20191022",
  regularSeasonEndDate: "20200415",
  playoffsBeginDate: "20200418",
  playoffsEndDate: "20200612"
};

const nbaStartSeasonYear = () => {
  return nba.regularSeasonStartDate.substring(0, 4);
};

nba.regularSeasonYear = nbaStartSeasonYear();

module.exports = {
  mlb: mlb,
  nfl: nfl,
  nba: nba
};
