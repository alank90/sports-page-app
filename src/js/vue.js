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
  template: "<div>MLB component</div>"
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
      gameData: [],
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
        const gameData = response.data.scoreboard.gameScore;
        this.gameData = gameData;
        // console.log(gameData[2].inningSummary.inning[4].awayScore);
      }); // End ==== get.then ====== //
  }, // end mounted()
  computed: {
    currentTabComponent: function() {
      return "tab-" + this.currentTab.toLowerCase();
    }
  }
});


// Test code =============================== //
var vm = new Vue({
	el: '#appTest',
	data: {
		message: 'Hello World!',
		x: 1,
		y: 2
	},
	methods: {
		showMessage: function() {
			alert(this.message);
		}
	},
	computed: {
		z: function() {
			return this.x + this.y;
		}
	}
});
console.log(vm);
