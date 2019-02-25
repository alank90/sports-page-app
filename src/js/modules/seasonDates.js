// ========== src/js/modules/seasonDates.js ================== //
const date = require("./todayDate");

let seasonYear = date.year;

const mlb = {
  regularSeasonStartDate: `${date.year}0328`,
  regularSeasonEndDate: `${date.year}0929`,
  playoffsBeginDate: `${date.year}1001`,
  playoffsEndDate: `${date.year}1101`
};

const nfl = {
  regularSeasonStartDate: "20190905",
  regularSeasonEndDate: "20191230",
  superbowlDate: new Date(2020, 1, 2), // Feb 02 2020
  superbowlOffsetDate: new Date(),
  daysToMilliseconds: 3600 * 24 * 7 * 1000
};

const nbaStartOfRegularSeasonYear = function(offset = 1) {
  if (date.today > `${date.year - 1}1231` && date.today < nba.playoffsEndDate) {
    let startOfRegularSeasonYear = seasonYear - offset;
    return startOfRegularSeasonYear;
  } else {
    return seasonYear;
  }
};

const nba = {
  startOfRegularSeasonYear: nbaStartOfRegularSeasonYear,
  regularSeasonStartDate: "20181016",
  regularSeasonEndDate: "20190410",
  playoffsBeginDate: "20190413",
  playoffsEndDate: "20190608"
};

module.exports = {
  mlb: mlb,
  nfl: nfl,
  nba: nba
};
