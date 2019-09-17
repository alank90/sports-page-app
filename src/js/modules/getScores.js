// /src/js/modules/getScores.js

const axios = require("axios");
const today = require("../modules/todayDate");
/* jshint ignore:start */

module.exports = async function(gameday, config) {
 
  return (await axios.get(
    `https://api.mysportsfeeds.com/v1.2/pull/nfl/${today.year}-regular/scoreboard.json?fordate=${gameday}`,
    config
  )).data.scoreboard.gameScore;
};
/* jshint ignore:end */
