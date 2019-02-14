// --------- src/modules/getBoxScores.js --------------- //
const axios = require("axios");

let boxScores = [];
let promises = [];

/* jshint ignore:start */
const getBoxScores = gameIDs => {
  gameIDs.forEach(function(item) {
    let myUrl = `https://api.mysportsfeeds.com/v1.2/pull/nba/2018-2019-regular/game_boxscore.json?gameid=${item}`;

    promises.push(
      axios({
        method: "get",
        headers: {
          Authorization:
            "Basic NzAxMzNkMmEtNzVmMi00MjdiLWI5ZDYtOTgyZTFhOnNwb3J0c2ZlZWRzMjAxOA=="
        },
        url: myUrl,
        params: {
          teamstats: "none",
          playerstats: "PTS,AST,REB,3PM",
          sort: "stats.PTS.D",
          limit: 3,
          force: true
        }
      })
    );
  });

  // axios.all returns a single Promise that resolves when all of the promises passed
  // as an iterable have resolved. This single promise, when resolved, is passed to the
  // "then" in "responses" parameter.
  axios.all(promises)
  return  promises;
};
/* jshint ignore:end */

module.exports = getBoxScores;
