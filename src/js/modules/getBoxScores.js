// --------- src/modules/getBoxScores.js --------------- //

let boxScores = [];
let promises = [];

// Reset config for Boxscore Query
config.params = {
  teamstats: "none",
  playerstats: "PTS,AST,REB,3PM",
  sort: "stats.PTS.D",
  limit: 3,
  force: true
};

/* jshint ignore:start */
const gameBoxScores = async gameIDs => {
  console.log(gameIDs);
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

  await axios.all(promises).then(function(results) {
    // Problem results is empty!!!
    results.forEach(function(response) {
      boxScores.push(response.data.gameboxscore);
    });
  });
};
/* jshint ignore:end */

module.exports = gameBoxScores;
