//src/js/vue.js
const Vue = require("vue");
const axios = require("axios");

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
      info: null
    };
  },
  mounted() {
    // Use Axios Get to retrieve the baseball info
    axios
      .get(
        "https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/scoreboard.json?fordate=20180804",
        config
      )
      .then(response => {
        this.info = response;
      });
  }
});
