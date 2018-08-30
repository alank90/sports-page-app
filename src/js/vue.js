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
    team: "nyy,nym,bos,hou,lad,atl",
    force: true
  }
};

Vue.component("tab-mlb", {
  props: ["baseball_data"],
  template: `
      <div class="flex-container">
        <div v-for="value in baseball_data">
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
  `
});
Vue.component("tab-nfl", {
  props: ['nfl_data'],
  template: `
    <div class="flex-container">NFL Component
      <div v-for="value in nfl_data">
          <p class="box-score-status is-completed" v-if="value.isCompleted">Final</p>

          <p class="box-score-team"> {{ value.game.awayTeam.City }} {{ value.game.awayTeam.Name }}</p>
          <span class="box-score-inning" v-for="inning_score in value.inningSummary.inning">
              {{inning_score.awayScore }}</span>
          <span class="box-score-final" v-bind:class="{ won: value.awayScore > value.homeScore }">{{ value.awayScore
              }}
          </span>
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
      mlbData: [],
      currentTab: "MLB",
      tabs: ["MLB", "NFL", "NBA"],
      isCompleted: false,
      gameDate: date.yesterday.substr(4, 2) + "." + date.yesterday.substr(6, 2)
    };
  },
  mounted() {
    // Use Axios Get to retrieve the baseball info
    axios
      .get(
        `https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/scoreboard.json?fordate=${
          date.yesterday
        }`,
        config
      )
      .then(response => {
        const mlbData = response.data.scoreboard.gameScore;
        this.mlbData = mlbData;
      }); // End ==== get.then ====== //
  }, // end mounted()
  computed: {
    currentTabComponent: function() {
      return "tab-" + this.currentTab.toLowerCase();
    },
    current_sports_props: function() {
      if(this.currentTab.toLowerCase() === "mlb") {
        return "baseball_data";
      } else {
        return this.currentTab.toLowerCase() + '_data';
      }
    }
  },
  methods: {
    getSportsData: function(tab) {
      this.currentTab = tab; // Set the currentTab

      // Let's check currentTab and make appropriate
      // API call
      if (this.currentTab === "NFL") {
        // reset axios config parameters
        config.params = {
          team: "nyg, nyj",
          force: true
        };

        axios
          .get(
            `https://api.mysportsfeeds.com/v1.2/pull/nfl/2017-regular/scoreboard.json?fordate=20171203`,
            config
          )
          .then(response => {
            const nflData = response.data.scoreboard.gameScore;
            this.nflData = nflData;
            console.log(Object.values(this.nflData));
          }); // End ==== get.then ====== //

        console.log("Call NFL API" + config.params);
      } else if (this.currentTab === "NBA") {
        console.log("Call NBA API");
      }
    } // end getSportsData
  }
});
