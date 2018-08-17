//src/js/vue.js
const Vue = require("vue");
const axios = require("axios");
const date = require("./todayDate");

// console.log(date.yesterday);
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
    team: "nyy,nym,bos,hou,lad",
    force: true
  }
};

new Vue({
  el: "#app",
  data() {
    return {
      gameData: [],
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
        const gameData = response.data.scoreboard.gameScore;
        this.gameData = gameData;
        console.log(gameData[2].inningSummary.inning[4].awayScore);
      }); // End ==== get.then ====== //
  } // end mounted()
});
