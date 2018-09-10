//src/js/vue.js
const Vue = require("vue");
const axios = require("axios");
const date = require("./todayDate");
const mySportsFeeds = require("./mySportsFeeds");

// Axios config object. Sent with get request
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

Vue.component("tab-mlb", {
  props: ["props_league_data", "props_league_standings"],
  template: `
      <div class="mlb-template">
        <div class="flex-container-scores">
          <div v-for="value in props_league_data">
              <p class="box-score-status is-completed" v-if="value.isCompleted">Final</p>

              <p class="box-score-team"> {{ value.game.awayTeam.City }} {{ value.game.awayTeam.Name }}</p>
              <span class="box-score-inning" v-for="inning_score in value.inningSummary.inning">
                  {{inning_score.awayScore }}</span>
              <span class="box-score-final" v-bind:class="{ won: value.awayScore > value.homeScore }">{{ value.awayScore
                  }}
              </span>

              <p class="box-score-team"> {{ value.game.homeTeam.City }} {{ value.game.homeTeam.Name }}</p>
              <span class="box-score-inning" v-for="inning_score in value.inningSummary.inning">
                  {{inning_score.homeScore }}</span>
              <span class="box-score-final" v-bind:class="{ won: value.homeScore > value.awayScore }">{{ value.homeScore
                  }}
              </span>
              <br>
          </div>
      </div>
            
      
        <div class="flex-container-standings">
          <div  class="box-score-team division-name" v-for="value in props_league_standings">
           {{ value['@name'] }} 

              <div class="box-score-team" v-for="item in value.teamentry"> 

                <span class=box-score-team>{{ item.team.Abbreviation }}</span>
                <span class=box-score-team>{{ item.stats.Wins['#text'] }}</span>
                <span class=box-score-team>{{ item.stats.Losses['#text'] }}</span>
                <span class=box-score-team>{{ item.stats.GamesBack['#text'] }}</span>
                <span class=box-score-team>{{ item.stats.WinPct['#text'] }}</span>
              </div>
            
          </div>
        </div>        
    </div> 
      
  `
});
Vue.component("tab-nfl", {
  props: ["props_league_data"],
  template: `
    <div class="flex-container">
      <div v-for="value in props_league_data">
          <p class="box-score-status is-completed" v-if="value.isCompleted">Final</p>

          <p class="box-score-team"> {{ value.game.awayTeam.City }} {{ value.game.awayTeam.Name }}</p>
          <span class="box-score-inning" v-for="quarter_score in value.quarterSummary.quarter">
                {{quarter_score.awayScore }}</span>
          <span class="box-score-final" v-bind:class="{ won: value.awayScore > value.homeScore }">{{ value.awayScore }}
          </span>

          <p class="box-score-team"> {{ value.game.homeTeam.City }} {{ value.game.homeTeam.Name }}</p>
          <span class="box-score-inning" v-for="quarter_score in value.quarterSummary.quarter">
                {{quarter_score.homeScore }}</span>
          <span class="box-score-final" v-bind:class="{ won: value.homeScore > value.awayScore }">{{ value.homeScore
              }}
          </span>
          <p class="box-score-team">Location:  {{ value.game.location }} </p>
          <br>
      </div>
    </div>
    `
});

Vue.component("tab-nba", {
  template: "<div>NBA component</div>"
});

new Vue({
  el: "#app",
  data() {
    return {
      vm_instance_data: [],
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
      //====== Get Standings From MySportsFeeds Site =========================== //
      // ======================================================================= //
      url = `https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/division_team_standings.json?teamstats=W,L,GB,Win %`;

      /* jshint ignore:start */
      // Note: We use the arrow function here because "this" is defined by where
      // getStandings() is called (the vue instance) not by where it is used.
      let getStandings = async () => {
        this.standings = await mySportsFeeds.feedsData(url);
      };
      /* jshint ignore:end */

      getStandings();
      // ====================================================================== //
      // ======= end Get Standings ================================================ //
      // ====================================================================== //

      // ======== Let's check currentTab and make appropriate API call =============== //
      // ======== Use Axios Get to retrieve the baseball info ======================== //
      if (this.currentTab === "MLB") {
        this.loading = true;
        config.params = {
          team: "nyy,nym,bos,hou,lad,atl",
          force: true
        };

        axios
          .get(
            `https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/scoreboard.json?fordate=${
              date.yesterday
            }`,
            config
          )
          .then(response => {
            this.vm_instance_data = response.data.scoreboard.gameScore;
          })
          .catch(error => {
            console.log(error);
            this.errored = true;
          })
          .finally(() => (this.loading = false));
        // End ==== get.then ====== //

        // ============================================================================= //
        // ================== else check if the NFL ==================================== //
        // ============================================================================= //
      } else if (this.currentTab === "NFL") {
        this.loading = true;
        // reset axios config parameters
        config.params = {
          team: "nyg,nyj,pit,ne,gb,oak,sea,phi,cle",
          force: true
        };

        axios
          .get(
            `https://api.mysportsfeeds.com/v1.2/pull/nfl/2017-regular/scoreboard.json?fordate=20171022`,
            config
          )
          .then(response => {
            this.vm_instance_data = response.data.scoreboard.gameScore;
          })
          .catch(error => {
            console.log(error);
            this.errored = true;
          })
          .finally(() => (this.loading = false));
        // End ==== get.then ====== //

        // ============================================================================= //
        // ================== else check if the NBA ==================================== //
        // ============================================================================= //
      } else if (this.currentTab === "NBA") {
        console.log("Call NBA API");
      }
    } // end getSportsData
  }
});
