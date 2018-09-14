// /src/js/vue.js

const Vue = require("vue");
const axios = require("axios");
const date = require("./modules/todayDate");
const mySportsFeeds = require("./modules/mySportsFeeds");
const mlbTemplate = require("./components/mlbComponent");
const nflTemplate = require("./components/nflComponent");
const nbaTemplate = require("./components/nbaComponent");

// Axios config object. Sent with Get request
const config = {
  // `headers` are custom headers to be sent
  headers: {
    Authorization:
      "Basic NzAxMzNkMmEtNzVmMi00MjdiLWI5ZDYtOTgyZTFhOnNwb3J0c2ZlZWRzMjAxOA=="
  },
  // `params` are the URL parameters to be sent with the request
  // Must be a plain object or a URLSearchParams object. Set for each API call
  // below.
  params: {}
};
// ================================================ //
// ========== Template Components Here ============ //
// ================================================ //
mlbTemplate();

nflTemplate();

nbaTemplate();
// ================================================ //
// ========== End Template Components ============= //
// ================================================ //


// ============================================================ //
// ========== Vue Instance Here =============================== //
// ============================================================ //
new Vue({
  el: "#app",
  data() {
    return {
      my_sports_feeds_data: [],
      standings: [],
      currentTab: "",
      tabs: ["MLB", "NFL", "NBA"],
      isCompleted: false,
      gameDate: date.yesterday.substr(4, 2) + "." + date.yesterday.substr(6, 2),
      loading: false,
      errored: false
    };
  },

  computed: {
    currentTabComponent: function() {
      return "tab-" + this.currentTab.toLowerCase();
    }
  },
  methods: {
    getSportsData: function(tab) {
      let url = "";
      this.currentTab = tab; // Set the currentTab

      // ====================================================================== //
      //====== Get Standings From MySportsFeeds Site ========================== //
      // ===================================================================== //

      /* jshint ignore:start */
      // Note: We use the arrow function here because "this" is defined by where
      // getStandings() is called (the vue instance) not by where it is used.
      let getStandings = async () => {
        this.standings = await mySportsFeeds.feedsData(url);
      };
      /* jshint ignore:end */

      // ===================================================================== //
      // ======= end getStandings  Method ==================================== //
      // ===================================================================== //

      // ======== Let's check currentTab and make appropriate API call =============== //
      // ======== Use Axios Get to retrieve the baseball info ======================== //
      if (this.currentTab === "MLB") {
        this.loading = true;
        config.params = {
          team: "nyy,nym,bos,hou,lad,atl,chc,cle,atl,col,mil,oak",
          force: true
        };

        // ============ First Get the Sports Scores =========================== //
        axios
          .get(
            `https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/scoreboard.json?fordate=${
              date.yesterday
            }`,
            config
          )
          .then(response => {
            this.my_sports_feeds_data = response.data.scoreboard.gameScore;
          })
          .catch(error => {
            console.log(error);
            this.errored = true;
          })
          .finally(() => (this.loading = false));
        // End ==== get.then ====== //
        // End Get MLB Scores ========= //

        // =============== Get MLB Standings ================ //
        url = `https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/division_team_standings.json?teamstats=W,L,GB,Win %`;
        getStandings();
        // =========== end Get MLB Standings ================ //

        // ============================================================================= //
        // ================== else check if the NFL ==================================== //
        // ============================================================================= //
      } else if (this.currentTab === "NFL") {
        this.loading = true;
        // reset axios config parameters
        config.params = {
          force: true
        };

        // ===================== Get NFL Scores ======================= //
        axios
          .get(
            `https://api.mysportsfeeds.com/v1.2/pull/nfl/2018-regular/scoreboard.json?fordate=20180909`,
            config
          )
          .then(response => {
            this.my_sports_feeds_data = response.data.scoreboard.gameScore;
          })
          .catch(error => {
            console.log(error);
            this.errored = true;
          })
          .finally(() => (this.loading = false));
        // ==== End get.then ====== //
        // ====================== End Get NFL Scores ==================== //

        // =================== Get NFL Standings ======================== //
        url = `https://api.mysportsfeeds.com/v1.2/pull/nfl/2018-regular/division_team_standings.json`;
        getStandings();
        // ================= End Get NFL Standings ===================== //

        // ============================================================================= //
        // ================== else check if the NBA ==================================== //
        // ============================================================================= //
      } else if (this.currentTab === "NBA") {
        console.log("Call NBA API");
      }
    } // === end getSportsData ===== //
  }
});
// ========================================================= //
// ========== End Vue Instance ============================= //
// ========================================================= //
