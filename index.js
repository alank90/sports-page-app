// ./index.js includes
require("./src/js/vue");

// if you want to add more js libs, just put the require statements here
const Axios = require("axios");
// Use Axios Get to retrieve the baseball info
Axios.get(
  " https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/scoreboard.json?fordate=20180805",
  {
    // `headers` are custom headers to be sent
    headers: {
      Authorization:
        "Basic NzAxMzNkMmEtNzVmMi00MjdiLWI5ZDYtOTgyZTFhOnNwb3J0c2ZlZWRzMjAxOA=="
    },
    // `params` are the URL parameters to be sent with the request
    // Must be a plain object or a URLSearchParams object
    params: {
      team: "nyy, bos",
      force: true
    }
  }
).then(function(response) {
  try {
    const gameData = response;
    console.log(gameData.data.scoreboard.gameScore[0]);
  } catch (error) {
    console.log(error);
  }
});
