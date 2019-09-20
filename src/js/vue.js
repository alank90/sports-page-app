// /src/js/vue.js

const Vue = require("vue");
const helperComponent = require("./components/topHelperComponent");
const axios = require("axios");
const league = require("./modules/seasonDates");
const date = require("./modules/todayDate");
const nflDate = require("./modules/nflDate");
const getStandings = require("./modules/getStandings");
const getScores = require("./modules/getScores");
const getBoxScores = require("../js/modules/getBoxScores");
const mlbComponent = require("./components/mlbComponent");
const nflComponent = require("./components/nflComponent");
const nbaComponent = require("./components/nbaComponent");

Vue.config.productionTip = false;

// By defining the EventBus globally you avoid having to import the
// EventBus in every component you would like to use it in.
Vue.prototype.$eventBus = new Vue();

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
  components: {
    mlbComponent: mlbComponent,
    nflComponent: nflComponent,
    nbaComponent: nbaComponent,
    helperComponent: helperComponent
  },
  data() {
    return {
      sports_feeds_data: [],
      sports_feeds_boxscores: {
        mlb: null,
        nfl: null,
        nba: null
      },
      baseball_playoffs: false,
      basketball_playoffs: false,
      nfl_playoffs: false,
      end_of_season: {
        mlb: false,
        nfl: false,
        nba: false
      },
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
      // Variable declarations
      let gameIDs = [];
      let nflGameIDs = [];
      let url = "";
      let leagueStandings = [];
      let seasonName = "";
      let teamStats = "";
      let typeOfStandings = "";
      this.currentTab = tab; // Set the currentTab

      // ======== Let's check currentTab and make appropriate API call =============== //
      // ======== Use Axios Get to retrieve the baseball info ======================== //

      if (this.currentTab === "MLB") {
        // If Off-Seson skip AJAX call and just print Off-Season template
        if (date.today <= league.mlb.regularSeasonStartDate) {
          this.end_of_season.mlb = true;
          return;
        }

        this.loading = true;
        this.sport_logo_image = "./src/img/" + this.currentTab + ".png";
        config.params = {
          force: true
        };

        // ========================================================================= //
        // ============ First Get the MLB Sports Scores =========================== //
        // ========================================================================= //

        // Check if it's the Regular, Post Season, or Off-Season ===================== //

        if (
          date.yesterday > league.mlb.regularSeasonStartDate &&
          date.yesterday <= league.mlb.regularSeasonEndDate
        ) {
          seasonName = `${date.year}-regular`;
        } else if (
          date.yesterday > `${league.mlb.playoffsBeginDate}` &&
          date.yesterday < `${league.mlb.playoffsEndDate}`
        ) {
          seasonName = `${date.year}-playoff`;
          config.params = "";
          this.baseball_playoffs = true;
        } else {
          console.log(
            "OOPS. Error in Baseball Offseason logic! Check your Season Dates."
          );
          return;
        }

        /* jshint ignore:start */
        axios
          .get(
            `https://api.mysportsfeeds.com/v1.2/pull/mlb/${seasonName}/scoreboard.json?fordate=${date.yesterday}`,
            config
          )
          .then(response => {
            this.sports_feeds_data = response.data.scoreboard.gameScore;
            return this.sports_feeds_data;
          })
          .then(response => {
            // Fill up array with all the game ID's for today's games that were
            // completed. This will be used to retrieve the Box Scores later
            response.forEach(function(item, index) {
              if (item.isCompleted === "true") {
                gameIDs[index] = item.game.ID;
              }
            });

            return gameIDs;
          })
          // Now call getBoxScores to retrieve MLB boxscores
          .then(async gameIDs => {
            const url = `https://api.mysportsfeeds.com/v1.2/pull/mlb/${seasonName}/game_boxscore.json?gameid=`;
            const params = {
              teamstats: "none",
              playerstats: "AB,H,R,HR,RBI,AVG,W,L,ERA,SV,SO,IP",
              sort: "player.position.D",
              force: true
            };
            // Check if boxscores have been retrieved on previous tab click
            this.sports_feeds_boxscores.mlb =
              this.sports_feeds_boxscores.mlb ||
              (await getBoxScores(gameIDs, url, params));
          })
          .catch(error => {
            console.log(error);
            this.errored = true;
          })
          .finally(() => (this.loading = false));
        // End ==== get.then ====== //
        /* jshint ignore:end */
        // ================================================================================= //
        // ============================ End Get MLB Scores ================================= //
        // ================================================================================= //

        // ================================================================================== //
        // =========================== Get MLB Standings ==================================== //
        // ================================================================================== //
        // Check if it's the Regular Season. If not Do Nothing. The API is garbage for
        // playoff standings

        if (date.yesterday < `${league.mlb.regularSeasonEndDate}`) {
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
        league.nfl.superbowlOffsetDate.setTime(
          league.nfl.superbowlDate - league.nfl.daysToMilliseconds
        );

        // Check if it is the Off-Season
        if (date.today < league.nfl.regularSeasonStartDate) {
          console.log("End of Football Season. See you next year!");
          this.end_of_season.nfl = true;
          return;
        } else if (
          date.today >=
            league.nfl.superbowlOffsetDate
              .toISOString()
              .substring(0, 10)
              .replace(/-/g, "") &&
          date.today <=
            league.nfl.superbowlDate
              .toISOString()
              .substring(0, 10)
              .replace(/-/g, "")
        ) {
          console.log(
            `Super Bowl on ${league.nfl.superbowlDate}. See you there!`
          );
          this.end_of_season.nfl = true;
          return;
        }
        // End Check for Off-season. Continue on if it is Football Season!

        this.loading = true;
        this.sport_logo_image = "./src/img/" + this.currentTab + ".png";
        // reset axios config parameters
        config.params = {
          force: true
        };

        // ===================== Get Sunday NFL Scores ======================= //
        // Check if it's the Regular or Post Season ===================== //
        if (
          date.yesterday >= `${league.nfl.regularSeasonStartDate}` &&
          date.yesterday <= `${league.nfl.regularSeasonEndDate}`
        ) {
          seasonName = `${date.year}-regular`;
        } else if (
          date.yesterday > `${league.nfl.regularSeasonEndDate}` &&
          date.yesterday < `${league.nfl.superbowlDate}`
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

          this.nfl_feeds.sunday_data.forEach(function(item, index) {
            if (item.isCompleted === "true") {
              nflGameIDs[index] = item.game.ID;
            }
          });

          console.log(nflGameIDs);
          this.loading = false;
        };
        /* jshint ignore:end */

        if (date.today <= league.nfl.superbowlDate) {
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
        url = `https://api.mysportsfeeds.com/v1.2/pull/nfl/${date.year}-regular/division_team_standings.json`;
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
        // first check if Off-Season and skip AJAX call
        if (
          date.today < `${league.nba.regularSeasonStartDate}` ||
          date.today > `${league.nba.playoffsEndDate}`
        ) {
          this.end_of_season.nba = true;
          return;
        }

        this.loading = true;
        this.sport_logo_image = "./src/img/" + this.currentTab + ".png";

        // reset axios config parameters
        config.params = {
          force: true
        };
        // ========================================================================= //
        // ================ Get the NBA Sports Scores ============================== //
        // ========================================================================= //

        // Check if it's the Regular or Post Season ================= //

        if (
          date.today > `${league.nba.regularSeasonStartDate}` &&
          date.today < `${league.nba.regularSeasonEndDate}`
        ) {
          seasonName = `${league.nba.startOfRegularSeasonYear()}-${league.nba.startOfRegularSeasonYear() +
            1}-regular`;
        } else if (
          date.yesterday > `${league.nba.playoffsBeginDate}` &&
          date.yesterday < `${league.nba.playoffsEndDate}`
        ) {
          seasonName = `${league.nba.startOfRegularSeasonYear() + 1}-playoff`;
          config.params = "";
        } else {
          console.log("OOPs! Error with NBA Season Dates. Please check them.");

          return;
        }

        /* jshint ignore:start */
        axios
          .get(
            `https://api.mysportsfeeds.com/v1.2/pull/nba/${seasonName}/scoreboard.json?fordate=${date.yesterday}`,
            config
          )
          .then(response => {
            this.sports_feeds_data = response.data.scoreboard.gameScore;
            return this.sports_feeds_data;
          })
          .then(response => {
            // Fill up array with all the game ID's for today's completed games.
            // This will be used to retrieve the Box Scores later
            response.forEach(function(item, index) {
              if (item.isCompleted === "true") {
                gameIDs[index] = item.game.ID;
              }
            });

            return gameIDs;
          })
          // Now call getBoxScores to retrieve NBA boxscores
          .then(async gameIDs => {
            const url = `https://api.mysportsfeeds.com/v1.2/pull/nba/${seasonName}/game_boxscore.json?gameid=`;
            const params = {
              teamstats: "none",
              playerstats: "PTS,AST,REB,3PM",
              sort: "stats.PTS.D",
              limit: 5,
              force: true
            };
            // Check if boxscores have been retrieved on previous tab click
            this.sports_feeds_boxscores.nba =
              this.sports_feeds_boxscores.nba ||
              (await getBoxScores(gameIDs, url, params));
          })
          // ================================================================================= //
          // ============================ End Get NBA Scores ================================= //
          // ================================================================================= //

          // ----------------------------------------------------------------------------------------------------------------------------------- //

          // ================================================================================== //
          // =========================== Get NBA Standings ==================================== //
          // ================================================================================== //
          // Call leagueStandings() now
          .then(() => {
            // Check if it's the Regular or Post Season
            if (
              date.yesterday > `${league.nba.regularSeasonStartDate}` &&
              date.yesterday < `${league.nba.regularSeasonEndDate}`
            ) {
              seasonName = `${league.nba.startOfRegularSeasonYear()}-${league.nba.startOfRegularSeasonYear() +
                1}-regular`;
              teamStats = `W,L,GB,Win %`;
              typeOfStandings = "division_team_standings";
            } else if (
              date.yesterday > `${league.nba.playoffsBeginDate}` &&
              date.yesterday < `${league.nba.playoffsEndDate}`
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

            // Note: We use the arrow function here because "this" is defined by where
            // getStandings() is called (the vue instance) not by where it is used.
            leagueStandings = async () => {
              this.standings = await getStandings(url);
            };

            leagueStandings();

            this.loading = false;
            // =============================================================================== //
            // =========================== End NBA Standings ================================= //
            // =============================================================================== //
          })
          .catch(error => {
            console.log(error);
            this.errored = true;
          });
        /* jshint ignore:end */
      }
    } // ================ end getSportsData =============================== //
  }
});

// ================================================================================================== //
// ====================================== End Vue Instance ========================================== //
// ================================================================================================== //
