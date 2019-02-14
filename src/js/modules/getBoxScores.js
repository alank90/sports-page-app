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

  axios
    .all(promises)
    .then(function(results) {
      results.forEach(function(response) {
        boxScores.push(response.data.gameboxscore);
      });

      return boxScores;
    })
    .then(function(boxScores) {
      console.log(boxScores);
      return boxScores;
    });
};
/* jshint ignore:end */

module.exports = getBoxScores;
