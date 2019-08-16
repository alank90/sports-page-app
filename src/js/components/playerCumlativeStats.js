const Vue = require("vue");
const { EventBus } = require("../modules/event-bus");

const playerCumlativeStats = {
  playerCumlativeStats: Vue.component("mlb-player-stats", {
    data() {
      return {
        currentPlayerId: ""
      };
    },
    mounted() {
      EventBus.$on("get-cumlative-stats", data => {
        // Assign playerid on eventBus to this component object
        // and have axios get player cumlative stats
        this.currentPlayerId = data;
        retrievePlayerStats(this.currentPlayerId);
      });
    },
    methods: {
      retrievePlayerStats: function(playerId) {
        const url = `https://api.mysportsfeeds.com/v1.2/pull/mlb/2019-regular/cumulative_player_stats.json?player=`;
        const params = {
          playerstats: "AB,H,HR,RBI,AVG",
          force: true
        };
        axios({
          method: "get",
          headers: {
            Authorization:
              "Basic NzAxMzNkMmEtNzVmMi00MjdiLWI5ZDYtOTgyZTFhOnNwb3J0c2ZlZWRzMjAxOA=="
          },
          url: url + playerId,
          params: params
        }).then(response => {
          console.log(response);
        });
      }
    },
    template: `
    <tr class="d-flex" v-if="this.boxGameScore">
    <td class="col-4 justify-content-center" scope="row">
        Test Name</td>
    </td>
    <td class="col-2 justify-content-center" justify-content="center">
        166</td>
    <td class="col-2 justify-content-center">22</td>
    <td class="col-2 justify-content-center">55</td>
    <td class="col-2 justify-content-center">88
    </td>
</tr>

    `
  })
};

module.exports = { playerCumlativeStats };
