// /src/js/modules/getScores.js

const axios = require("axios");
/* jshint ignore:start */

module.exports = async function(gameday, config) {
  return (await axios.get(
    `https://api.mysportsfeeds.com/v1.2/pull/nfl/2018-regular/scoreboard.json?fordate=${gameday}`,
    config
  )).data.scoreboard.gameScore;
};
/* jshint ignore:end */
