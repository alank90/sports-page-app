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
  props: ['baseballData'],
  template: 
    `
      <div class="flex-container">
      <div v-for="value in baseballData">
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
  template: "<div>NFL component</div>"
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
    }
  }
});


// Need on:click now to retrieve data for other buttons when clicked
/* methods: {
  getSportData: function (tab) {
    currentTab = tab;
    console.log(`This is currentTab: ${currentTab}`);
    console.log(`This is tab: ${tab}`);
    currentTabComponent();
    // return "tab-" + this.currentTab.toLowerCase();
     // `this` inside methods points to the Vue instance
    
    // `event` is the native DOM event
    /* if (event) {
      console.log(`This is event ${event.target.tagName}`);
    } 
  }
} */

