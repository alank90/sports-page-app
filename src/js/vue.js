//src/js/vue.js
const Vue = require("vue");
const axios = require("axios");
const date = require("./todayDate");

// Axios config object. Sent with get request
const config = {
  // `headers` are custom headers to be sent
  headers: {
    Authorization:
      "Basic NzAxMzNkMmEtNzVmMi00MjdiLWI5ZDYtOTgyZTFhOnNwb3J0c2ZlZWRzMjAxOA=="
  },
  // `params` are the URL parameters to be sent with the request
  // Must be a plain object or a URLSearchParams object
  params: {
    team: "nyy",
    force: true
  }
};

new Vue({
  el: "#app",
  data() {
    return {
      awayTeam: null,
      homeTeam: null,
      isCompleted: false,
      gameDate: date.yesterday.substring(date.yesterday.length - 4)
    };
  },
  mounted() {
    // Use Axios Get to retrieve the baseball info
    axios
      .get(
        `https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/scoreboard.json?fordate=${date.yesterday}`,
        config
      )
      .then(response => {
        const scorePrefix = response.data.scoreboard.gameScore[0];
        const awayScore = response.data.scoreboard.gameScore[0].awayScore;
        const homeScore = response.data.scoreboard.gameScore[0].homeScore;
        // Output Game Status
        this.isCompleted = scorePrefix.isCompleted;
       // Output Team Scores
        this.awayTeam = `${scorePrefix.game.awayTeam.City} ${
          scorePrefix.game.awayTeam.Name
        } ${awayScore}`;
        this.homeTeam = `${scorePrefix.game.homeTeam.City} ${
          scorePrefix.game.homeTeam.Name
        } ${homeScore}`;
                
        console.log(isCompleted);
      }); // End ==== get.then ====== //
  } // end mounted()
});
