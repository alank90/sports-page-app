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
  <div class="vue-root-element">
    <div class="container mlb-scores">
      <div class="row">
            <div class="col-xs-12 col-md-4 col-lg-3" v-for="value in props_league_data">
                <table class="table table-striped table-sm">
                      <thead>
                          <th scope="col" class="box-score-status is-completed" v-if="value.isCompleted">Final</th>
                      </thead>

                      <img scope="row" v-if="value.game.awayTeam.Abbreviation === 'NYY'" src="./src/img/nyy.png">
                      <img scope="row" v-if="value.game.homeTeam.Abbreviation === 'NYY'" src="./src/img/nyy.png">
                      <img scope="row" v-if="value.game.awayTeam.Abbreviation === 'NYM'" src="./src/img/nym.png">
                      <img scope="row" v-if="value.game.homeTeam.Abbreviation === 'NYM'" src="./src/img/nym.png">

                      <tbody>
                          <tr>
                              <td class="box-score-team"> {{ value.game.awayTeam.Abbreviation }} </td>
                              <td class="box-score-inning" v-for="inning_score in value.inningSummary.inning">
                                  {{inning_score.awayScore }}</td>
                              <td class="box-score-final" v-bind:class="{ won: value.awayScore > value.homeScore }">{{
                                  value.awayScore
                                  }}
                              </td>
                          </tr>
                          <tr>
                              <td class="box-score-team"> {{ value.game.homeTeam.Abbreviation }} </td>
                              <td class="box-score-inning" v-for="inning_score in value.inningSummary.inning">
                                  {{inning_score.homeScore }}
                              </td>
                              <td class="box-score-final" v-bind:class="{ won: value.homeScore > value.awayScore }">{{
                                  value.homeScore }}
                              </td>
                          </tr>
                      </tbody>
                  </table>
            </div> <!-- End v-for -->
          
      </div> <!-- End of row -->
    </div> <!-- End container -->


      <hr>
      <div class="container mlb-standings">
          <div class="row">
              <div class="col-12 col-md-4 division-name" v-for="value in props_league_standings">
                  {{ value['@name'] }}
                  <div class="box-score-team" v-for="item in value.teamentry">
                      <table class="table table-striped table-sm">
                          <thead>
                              <th scope="col"></th>
                              <th scope="col">{{ item.stats.Wins['@abbreviation'] }}</th>
                              <th scope="col">{{ item.stats.Losses['@abbreviation'] }}</th>
                              <th scope="col">{{ item.stats.GamesBack['@abbreviation'] }}</th>
                              <th scope="col">{{ item.stats.WinPct['@abbreviation'] }}</th>
                          </thead>
                          <tbody>
                              <tr>
                                  <td class="box-score-team">{{ item.team.Abbreviation }}</td>
                                  <td class="box-score-team">{{ item.stats.Wins['#text'] }}</td>
                                  <td class="box-score-team">{{ item.stats.Losses['#text'] }}</td>
                                  <td class="box-score-team">{{ item.stats.GamesBack['#text'] }}</td>
                                  <td class="box-score-team">{{ item.stats.WinPct['#text'].slice(1) }}</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </div> <!-- End v-for -->
          </div> <!-- End of row -->
      </div>  <!-- End container -->  
  </div> <!-- End Vue root -->
      
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
          team: "nyy,nym,bos,hou,lad,atl,chc,cle,atl,col,mil,oak",
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
