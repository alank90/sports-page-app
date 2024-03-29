// ========== src/js/modules/seasonDates.js ================== //
const date = require("./todayDate");

const mlb = {
  regularSeasonStartDate: "20210401",
  regularSeasonEndDate: "20210930",
  playoffsBeginDate: "20211001",
  playoffsEndDate: "20211101",
};

const nfl = {
  regularSeasonStartDate: "20210909",
  regularSeasonEndDate: "20220109",
  superbowlDate: new Date(2022, 1, 6), // Feb 06 2022
  superbowlOffsetDate: new Date(),
  daysToMilliseconds: 3600 * 24 * 7 * 1000,
};

const nba = {
  regularSeasonStartDate: "20211019",
  regularSeasonEndDate: "20220410",
  playoffsBeginDate: "20220412",
  playoffsEndDate: "20220619",
};

const nbaStartSeasonYear = () => {
  return nba.regularSeasonStartDate.substring(0, 4);
};

nba.regularSeasonYear = nbaStartSeasonYear();

module.exports = {
  mlb: mlb,
  nfl: nfl,
  nba: nba,
};
