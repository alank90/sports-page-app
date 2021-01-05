// /src/js/modules/getScores.js

const axios = require("axios");
const today = require("../modules/todayDate");
let seasonYear = "";
/* jshint ignore:start */

module.exports = async function (gameday, config) {
  if (today.month == 1 || 2) {
    seasonYear = today.lastYear;
  } else {
    seasonYear = today.year;
  }
  return (
    await axios.get(
      `https://api.mysportsfeeds.com/v1.2/pull/nfl/${seasonYear}-regular/scoreboard.json?fordate=${gameday}`,
      config
    )
  ).data.scoreboard.gameScore;
};
/* jshint ignore:end */
