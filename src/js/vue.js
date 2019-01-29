// /src/js/vue.js

const Vue = require("vue");
const helperComponent = require("./components/topHelperComponent");
const axios = require("axios");
const date = require("./modules/todayDate");
const nflDate = require("./modules/nflDate");
const getStandings = require("./modules/getStandings");
const getScores = require("./modules/getScores");
const mlbComponent = require("./components/mlbComponent");
const nflComponent = require("./components/nflComponent");
const nbaComponent = require("./components/nbaComponent");

Vue.config.productionTip = true;

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

// ========================================================================== //
// ========================== Components Here =============================== //
// ========================================================================== //
/* jshint ignore:start */
mlbComponent.mlb;

nflComponent.nfl;

nbaComponent.nba;

helperComponent.toTop;

/* jshint ignore:end */
// ============================================================================ //
// ========== End Components ================================================== //
// ============================================================================ //

// Starting Vue Component. Need this so don't throw Vue error message about
// no custom element "tab-" on first render.
Vue.component("tab-", {
  template: `<span></span>`
});

// ============================================================================ //
// ========================== Vue Instance Here =============================== //
// ============================================================================ //
new Vue({
  el: "#app",
  data() {
    return {
      sports_feeds_data: [],
      baseball_playoffs: false,
      basketball_playoffs: false,
      nfl_playoffs: false,
      end_of_season: false,
      nfl_feeds: {
        sunday_data: [],
        thurs_data: [],
        mon_data: []
      },
      standings: [],
      currentTab: "",
      sport_logo_image: "",
      tabs: ["MLB", "NFL", "NBA"],
      won: false,
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
      let leagueStandings = [];
      let seasonName = "";
      let teamStats = "";
      let typeOfStandings = "";
      this.currentTab = tab; // Set the currentTab

      // ======== Let's check currentTab and make appropriate API call =============== //
      // ======== Use Axios Get to retrieve the baseball info ======================== //
      if (this.currentTab === "MLB") {
        this.loading = true;
        this.sport_logo_image = "./src/img/" + this.currentTab + ".png";
        config.params = {
          team: "nyy,nym,bos,hou,lad,atl,chc,cle,atl,col,mil,oak",
          force: true
        };

        // ========================================================================= //
        // ============ First Get the MLB Sports Scores =========================== //
        // ========================================================================= //

        // Check if it's the Regular or Post Season ===================== //
        if (date.yesterday < `${date.year}1001`) {
          seasonName = `${date.year}-regular`;
        } else if (
          date.yesterday > `${date.year}1001` &&
          date.yesterday < `${date.year}1101`
        ) {
          seasonName = `${date.year}-playoff`;
          config.params = "";
          this.baseball_playoffs = true;
        } else {
          this.loading = false;
          this.end_of_season = true;
          return;
        }

        axios
          .get(
            `https://api.mysportsfeeds.com/v1.2/pull/mlb/${seasonName}/scoreboard.json?fordate=${
              date.yesterday
            }`,
            config
          )
          .then(response => {
            this.sports_feeds_data = response.data.scoreboard.gameScore;
          })
          .catch(error => {
            console.log(error);
            this.errored = true;
          })
          .finally(() => (this.loading = false));
        // End ==== get.then ====== //
        // ================================================================================= //
        // ============================ End Get MLB Scores ================================= //
        // ================================================================================= //

        // ================================================================================== //
        // =========================== Get MLB Standings ==================================== //
        // ================================================================================== //
        // Check if it's the Regular Season. If not Do Nothing. The API is garbage for
        // playoff standings

        if (date.yesterday < `${date.year}1001`) {
          seasonName = `${date.year}-regular`;
          teamStats = `W,L,GB,Win %`;
          typeOfStandings = "division_team_standings";
        }

        url = `https://api.mysportsfeeds.com/v1.2/pull/mlb/${seasonName}/${typeOfStandings}.json?teamstats=${teamStats}`;
        /* jshint ignore:start */
        // Note: We use the arrow function here because "this" is defined by where
        // getStandings() is called (the vue instance) not by where it is used.
        leagueStandings = async () => {
          this.standings = await getStandings(url);
        };
        /* jshint ignore:end */
        leagueStandings();
        // ================================================================================== //
        // =========================== End MLB Standings ==================================== //
        // ================================================================================== //

        // --------------------------------------------------------------------------------------- //

        // ================================================================================= //
        // ================== else check if the NFL ======================================== //
        // ================================================================================= //
      } else if (this.currentTab === "NFL") {
        // First set regular season start and end dates
        const regularSeasonStartDate = "20190905";
        const regularSeasonEndDate = "20191230";
        let superbowlDate = new Date(2019, 1, 3); // Feb 03 2019
        let superbowlOffsetDate = new Date();
        const daysToMilliseconds = 3600 * 24 * 7 * 1000;
        superbowlOffsetDate.setTime(superbowlDate - daysToMilliseconds);

        // Check if it is the Off-Season
        if (
          date.today >
            superbowlDate
              .toISOString()
              .substring(0, 10)
              .replace(/-/g, "") &&
          date.today < regularSeasonStartDate
        ) {
          console.log("End of Football Season. See you next year!");
          this.end_of_season = true;
          return;
        } else if (
          date.today >=
            superbowlOffsetDate
              .toISOString()
              .substring(0, 10)
              .replace(/-/g, "") &&
          date.today <=
            superbowlDate
              .toISOString()
              .substring(0, 10)
              .replace(/-/g, "")
        ) {
          console.log(`Super Bowl on ${superbowlDate}. See you there!`);
          this.end_of_season = true;
          return;
        }

        this.loading = true;
        this.sport_logo_image = "./src/img/" + this.currentTab + ".png";
        // reset axios config parameters
        config.params = {
          force: true
        };

        // ===================== Get Sunday NFL Scores ======================= //
        // Check if it's the Regular or Post Season ===================== //
        if (
          date.yesterday >= `${regularSeasonStartDate}` &&
          date.yesterday <= `${regularSeasonEndDate}`
        ) {
          seasonName = `${date.year}-regular`;
        } else if (
          date.yesterday > `${regularSeasonEndDate}` &&
          date.yesterday < `${superbowlDate}`
        ) {
          seasonName = `${date.year}-playoff`;
          config.params = "";
          this.nfl_playoffs = true;
        }

        /* jshint ignore:start */
        const sundayNFLScores = async () => {
          this.nfl_feeds.sunday_data = await getScores(
            nflDate.sundayDate,
            config
          );
          this.loading = false;
        };
        /* jshint ignore:end */

        if (date.today <= superbowlDate) {
          sundayNFLScores(); // Always call Sunday Scores Regular or Playoffs.
        }

        // ================= Get Thursday NFL Scores ========================= //
        /* jshint ignore:start */
        const thursdayNFLScores = async () => {
          this.nfl_feeds.thurs_data = await getScores(
            nflDate.thursdayDate,
            config
          );
        };
        /* jshint ignore:end */

        if (this.nfl_playoffs === false) {
          thursdayNFLScores();
        }
        // ================== Get Monday Night NFL Scores ============================= //
        /* jshint ignore:start */
        const mondayNFLScores = async () => {
          this.nfl_feeds.mon_data = await getScores(nflDate.mondayDate, config);
        };
        /* jshint ignore:end */

        if (this.nfl_playoffs === false) {
          mondayNFLScores();
        }
        // ============================================================== //
        // ====================== End Get NFL Scores ==================== //
        // ============================================================== //

        // ============================================================== //
        // =================== Get NFL Standings ======================== //
        url = `https://api.mysportsfeeds.com/v1.2/pull/nfl/2018-regular/division_team_standings.json`;
        /* jshint ignore:start */
        leagueStandings = async () => {
          this.standings = await getStandings(url);
        };
        /* jshint ignore:end */
        leagueStandings();
        // ============================================================== //
        // ================= End Get NFL Standings ====================== //
        // ============================================================= //

        // --------------------------------------------------------------------------------------- //

        // ============================================================== //
        // ================== else check if the NBA ===================== //
        // ============================================================== //
      } else if (this.currentTab === "NBA") {
        this.loading = true;
        this.sport_logo_image = "./src/img/" + this.currentTab + ".png";
        let startOfSeasonYear = date.year;
        if (
          date.today > `${date.year - 1}1231` &&
          date.today < `${date.year}0701`
        ) {
          startOfSeasonYear = startOfSeasonYear - 1;
        }
        // reset axios config parameters
        config.params = {
          force: true
        };
        // ========================================================================= //
        // ================ Get the NBA Sports Scores ============================== //
        // ========================================================================= //

        // Check if it's the Regular or Post Season ================= //
        if (
          date.today > `${startOfSeasonYear}1015` &&
          date.today < `${startOfSeasonYear + 1}0412`
        ) {
          seasonName = `${startOfSeasonYear}-${startOfSeasonYear + 1}-regular`;
        } else if (
          date.yesterday > `${startOfSeasonYear + 1}0412` &&
          date.yesterday < `${startOfSeasonYear + 1}0607`
        ) {
          seasonName = `${startOfSeasonYear}-playoff`;
          config.params = "";
        } else {
          console.log("End of Basketball Season. See you next year!");
          this.end_of_season = true;
          return;
        }

        axios
          .get(
            `https://api.mysportsfeeds.com/v1.2/pull/nba/${seasonName}/scoreboard.json?fordate=${
              date.yesterday
            }`,
            config
          )
          .then(response => {
            this.sports_feeds_data = response.data.scoreboard.gameScore;
          })
          .catch(error => {
            console.log(error);
            this.errored = true;
          })
          .finally(() => (this.loading = false));
        // End ==== get.then ====== //
        // ================================================================================= //
        // ============================ End Get NBA Scores ================================= //
        // ================================================================================= //

        // ================================================================================== //
        // =========================== Get NBA Standings ==================================== //
        // ================================================================================== //
        // Check if it's the Regular or Post Season
        if (date.yesterday > `${startOfSeasonYear}1015`) {
          seasonName = `${startOfSeasonYear}-${startOfSeasonYear + 1}-regular`;
          teamStats = `W,L,GB,Win %`;
          typeOfStandings = "division_team_standings";
        } else if (
          date.yesterday > `${startOfSeasonYear + 1}0412` &&
          date.yesterday < `${startOfSeasonYear + 1}0607`
        ) {
          seasonName = `${date.year}-playoff`;
          this.basketball_playoffs = true;
          teamStats = `W,L`;
          typeOfStandings = "division_team_standings";
          config.params = "";
        } else {
          console.log("End of Basketball Season. See you next year!");
        }

        url = `https://api.mysportsfeeds.com/v1.2/pull/nba/${seasonName}/${typeOfStandings}.json?teamstats=${teamStats}`;
        /* jshint ignore:start */
        // Note: We use the arrow function here because "this" is defined by where
        // getStandings() is called (the vue instance) not by where it is used.
        leagueStandings = async () => {
          this.standings = await getStandings(url);
        };
        /* jshint ignore:end */
        leagueStandings();
        // =============================================================================== //
        // =========================== End NBA Standings ================================= //
        // =============================================================================== //
      }
    } // ================ end getSportsData =============================== //
  }
});

// ================================================================================================== //
// ====================================== End Vue Instance ========================================== //
// ================================================================================================== //
