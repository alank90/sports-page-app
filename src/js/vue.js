// /src/js/vue.js

const Vue = require("vue");
const helperComponent = require("./components/topHelperComponent");
const axios = require("axios");
const seasonDates = require("./modules/seasonDates");
const date = require("./modules/todayDate");
const nflDate = require("./modules/nflDate");
const getStandings = require("./modules/getStandings");
const getScores = require("./modules/getScores");
const getBoxScores = require("../js/modules/getBoxScores");
const mlbComponent = require("./components/mlb/mlbComponent");
const nflComponent = require("./components/nfl/nflComponent");
const nbaComponent = require("./components/nba/nbaComponent");
const router = require("../router/index.js");


Vue.config.productionTip = false;

// By defining the EventBus globally you avoid having to import the
// EventBus in every component you would like to use it in.
Vue.prototype.$eventBus = new Vue();

// Axios config object. Sent with Get request
const config = {
  // `headers` are custom headers to be sent
  headers: {
    Authorization:
      "Basic NzAxMzNkMmEtNzVmMi00MjdiLWI5ZDYtOTgyZTFhOnNwb3J0c2ZlZWRzMjAxOA==",
  },
  // `params` are the URL parameters to be sent with the request
  // Must be a plain object or a URLSearchParams object. Set for each API call
  // below.
  params: {},
};

// Starting Vue Component. Need this so don't throw Vue error message about
// no custom element "tab-" on first render.
Vue.component("tab-", {
  template: `<span></span>`,
});

// ============================================================================ //
// ========================== Vue Instance Here =============================== //
// ============================================================================ //
new Vue({
  el: "#app",
  router,
  components: {
    mlbComponent: mlbComponent,
    nflComponent: nflComponent,
    nbaComponent: nbaComponent,
    helperComponent: helperComponent,
  },
  data() {
    return {
      sports_feeds_data: [],
      sports_feeds_boxscores_mlb: null,
      sports_feeds_boxscores_nfl: {
        sun: null,
        mon: null,
        thu: null,
      },
      sports_feeds_boxscores_nba: null,
      baseball_playoffs: false,
      basketball_playoffs: false,
      nfl_playoffs: false,
      end_of_season: {
        mlb: false,
        nfl: false,
        nba: false,
      },
      nfl_feeds: {
        sunday_data: [],
        thurs_data: [],
        mon_data: [],
      },
      standings: [],
      currentTab: "",
      sport_logo_image: "",
      tabs: ["MLB", "NFL", "NBA"],
      won: false,
      isCompleted: false,
      gameDate: date.yesterday.substr(4, 2) + "." + date.yesterday.substr(6, 2),
      loading: false,
      errored: false,
    };
  },
  computed: {
    currentTabComponent: function () {
      return "tab-" + this.currentTab.toLowerCase();
    },
  },
  methods: {
    getSportsData: function (tab) {
      // Variable declarations
      let mlbGameIDs = [];
      let nflGameIDs = {
        sunday: [],
        thursday: [],
        monday: [],
      };
      let nbaGameIDs = [];
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
        if (date.today >= seasonDates.mlb.playoffsEndDate) {
          this.end_of_season.mlb = true;
          return;
        }

        this.loading = true;
        this.sport_logo_image = "./src/img/" + this.currentTab + ".png";
        config.params = {
          force: true,
        };
        this.errored = false; // reset if true from another tab

        // ========================================================================= //
        // ============ First Get the MLB Sports Scores =========================== //
        // ========================================================================= //

        // Check if it's the Regular, Post Season, or Off-Season ===================== //

        if (
          date.yesterday > seasonDates.mlb.regularSeasonStartDate &&
          date.yesterday <= seasonDates.mlb.regularSeasonEndDate
        ) {
          seasonName = `${date.year}-regular`;
        } else if (
          date.yesterday > `${seasonDates.mlb.playoffsBeginDate}` &&
          date.yesterday < `${seasonDates.mlb.playoffsEndDate}`
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
          .then((response) => {
            this.sports_feeds_data = response.data.scoreboard.gameScore;
            return this.sports_feeds_data;
          })
          .then((response) => {
            // Fill up array with all the game ID's for today's games that were
            // completed. This will be used to retrieve the Box Scores later
            response.forEach(function (item, index) {
              if (item.isCompleted === "true") {
                mlbGameIDs[index] = item.game.ID;
              }
            });

            return mlbGameIDs;
          })
          // Now call getBoxScores to retrieve MLB boxscores
          .then(async (mlbGameIDs) => {
            const url = `https://api.mysportsfeeds.com/v1.2/pull/mlb/${seasonName}/game_boxscore.json?gameid=`;
            const params = {
              teamstats: "none",
              playerstats: "AB,H,R,HR,RBI,AVG,W,L,ERA,SV,SO,IP",
              sort: "player.position.D",
              force: true,
            };
            // Check if boxscores have been retrieved on previous tab click
            this.sports_feeds_boxscores_mlb =
              this.sports_feeds_boxscores_mlb ||
              (await getBoxScores(mlbGameIDs, url, params));
          })
          .catch((error) => {
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

        if (date.yesterday < `${seasonDates.mlb.regularSeasonEndDate}`) {
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
        seasonDates.nfl.superbowlOffsetDate.setTime(
          seasonDates.nfl.superbowlDate - seasonDates.nfl.daysToMilliseconds
        );

        this.errored = false; // reset if true from another tab

        // Check if it is the Off-Season
        if (date.today < seasonDates.nfl.regularSeasonStartDate) {
          console.log("End of Football Season. See you next year!");
          this.end_of_season.nfl = true;
          return;
        } else if (
          date.today >=
            seasonDates.nfl.superbowlOffsetDate
              .toISOString()
              .substring(0, 10)
              .replace(/-/g, "") &&
          date.today <=
            seasonDates.nfl.superbowlDate
              .toISOString()
              .substring(0, 10)
              .replace(/-/g, "")
        ) {
          console.log(
            `Super Bowl on ${seasonDates.nfl.superbowlDate}. See you there!`
          );
          this.end_of_season.nfl = true;
          return;
        }
        // End Check for Off-season. Continue on if it is Football Season!
        // Also check if any results returned from feeds API call
        //if (this.nfl_feeds.sunday_data.length > 0) this.loading = true;
        this.loading = true;

        this.sport_logo_image = "./src/img/" + this.currentTab + ".png";
        // reset axios config parameters
        config.params = {
          force: true,
        };

        // ===================== Get NFL Scores and Game Boxscores ======================= //
        // Check if it's the Regular or Post Season ===================== //
        if (
          date.yesterday >= `${seasonDates.nfl.regularSeasonStartDate}` &&
          date.yesterday <= `${seasonDates.nfl.regularSeasonEndDate}`
        ) {
          seasonName = `${date.year}-regular`;
        } else if (
          date.yesterday > `${seasonDates.nfl.regularSeasonEndDate}` &&
          date.yesterday < `${seasonDates.nfl.superbowlDate}`
        ) {
          seasonName = `${date.year}-playoff`;
          config.params = "";
          this.nfl_playoffs = true;
        }

        // First let's get the Game and BoxScores Data
        const nflScores = async () => {
          this.nfl_feeds.sunday_data = await getScores(
            nflDate.sundayDate,
            config
          );

          this.nfl_feeds.thurs_data = await getScores(
            nflDate.thursdayDate,
            config
          );

          this.nfl_feeds.mon_data = await getScores(nflDate.mondayDate, config);

          // Next we need the gameid's to retrieve the game boxscores for each day
          if (this.nfl_feeds.sunday_data != undefined) {
            this.nfl_feeds.sunday_data.forEach(function (item, index) {
              if (item.isCompleted === "true") {
                nflGameIDs.sunday[index] = item.game.ID;
              }
            });
          }

          if (this.nfl_feeds.thurs_data != undefined) {
            this.nfl_feeds.thurs_data.forEach(function (item, index) {
              if (item.isCompleted === "true") {
                nflGameIDs.thursday[index] = item.game.ID;
              }
            });
          }

          if (this.nfl_feeds.mon_data != undefined) {
            this.nfl_feeds.mon_data.forEach(function (item, index) {
              if (item.isCompleted === "true") {
                nflGameIDs.monday[index] = item.game.ID;
              }
            });
          }

          // Let's retrieve the boxscore's for the day's game
          // and put them in this.sports_feeds_boxscores.nfl.[day] for
          // use in the nflComponent component
          const url = `https://api.mysportsfeeds.com/v1.2/pull/nfl/${seasonName}/game_boxscore.json?gameid=`;
          const params = {
            teamstats: "none",
            playerstats:
              "Att,Comp,Yds,Rec,TD,Tgt,Avg,Lng,Total,Sacks,Int,Forced",
            sort: "player.position.D",
            force: true,
          };

          // Check if boxscores have been retrieved on previous tab click for each day
          // if not retrieve the boxscores
          this.sports_feeds_boxscores_nfl.sun =
            this.sports_feeds_boxscores_nfl.sun ||
            (await getBoxScores(nflGameIDs.sunday, url, params));

          this.sports_feeds_boxscores_nfl.thu =
            this.sports_feeds_boxscores_nfl.thu ||
            (await getBoxScores(nflGameIDs.thursday, url, params));

          this.sports_feeds_boxscores_nfl.mon =
            this.sports_feeds_boxscores_nfl.mon ||
            (await getBoxScores(nflGameIDs.monday, url, params));

          this.loading = false;
        }; /* End nflScores Async function */

        if (date.today <= seasonDates.nfl.superbowlDate) {
          nflScores(); // Always call nflScores Regular or Playoffs.
        }

        // ============================================================== //
        // ====================== End Get NFL Scores ==================== //
        // ============================================================== //

        // ============================================================== //
        // =================== Get NFL Standings ======================== //
        url = `https://api.mysportsfeeds.com/v1.2/pull/nfl/${date.year}-regular/division_team_standings.json`;

        leagueStandings = async () => {
          this.standings = await getStandings(url);
        };

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
          date.today <= `${seasonDates.nba.regularSeasonStartDate}` ||
          date.today >= `${seasonDates.nba.playoffsEndDate}`
        ) {
          this.end_of_season.nba = true;
          return;
        }

        this.loading = true;
        this.sport_logo_image = "./src/img/" + this.currentTab + ".png";
        this.errored = false; // reset if true from another tab

        // reset axios config parameters
        config.params = {
          force: true,
        };
        // ========================================================================= //
        // ================ Get the NBA Sports Scores ============================== //
        // ========================================================================= //

        // Check if it's the Regular or Post Season ================= //

        if (
          date.today > `${seasonDates.nba.regularSeasonStartDate}` &&
          date.today < `${seasonDates.nba.regularSeasonEndDate}`
        ) {
          seasonName = `${seasonDates.nba.regularSeasonYear}-${
            +seasonDates.nba.regularSeasonYear + 1
          }-regular`;
        } else if (
          date.yesterday > `${seasonDates.nba.playoffsBeginDate}` &&
          date.yesterday < `${seasonDates.nba.playoffsEndDate}`
        ) {
          seasonName = `${seasonDates.nba.regularSeasonYear + 1}-playoff`;
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
          .then((response) => {
            this.sports_feeds_data = response.data.scoreboard.gameScore;
            return this.sports_feeds_data;
          })
          .then((response) => {
            // Fill up array with all the game ID's for today's completed games.
            // This will be used to retrieve the Box Scores later
            response.forEach(function (item, index) {
              if (item.isCompleted === "true") {
                nbaGameIDs[index] = item.game.ID;
              }
            });

            return nbaGameIDs;
          })
          // Now call getBoxScores to retrieve NBA boxscores
          .then(async (nbaGameIDs) => {
            const url = `https://api.mysportsfeeds.com/v1.2/pull/nba/${seasonName}/game_boxscore.json?gameid=`;
            const params = {
              teamstats: "none",
              playerstats: "PTS,AST,REB,3PM",
              sort: "stats.PTS.D",
              limit: 8,
              force: true,
            };
            // Check if boxscores have been retrieved on previous tab click
            this.sports_feeds_boxscores_nba =
              this.sports_feeds_boxscores_nba ||
              (await getBoxScores(nbaGameIDs, url, params));
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
              date.yesterday > `${seasonDates.nba.regularSeasonStartDate}` &&
              date.yesterday < `${seasonDates.nba.regularSeasonEndDate}`
            ) {
              seasonName = `${seasonDates.nba.regularSeasonYear}-${
                +seasonDates.nba.regularSeasonYear + 1
              }-regular`;
              teamStats = `W,L,GB,Win %`;
              typeOfStandings = "division_team_standings";
            } else if (
              date.yesterday > `${seasonDates.nba.playoffsBeginDate}` &&
              date.yesterday < `${seasonDates.nba.playoffsEndDate}`
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
          .catch((error) => {
            console.log(error);
            this.errored = true;
          });
        /* jshint ignore:end */
      }
    }, // ================ end getSportsData =============================== //
  },
});

// ================================================================================================== //
// ====================================== End Vue Instance ========================================== //
// ================================================================================================== //
