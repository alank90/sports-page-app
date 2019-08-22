const Vue = require("vue");
const axios = require("axios");

const playerCumlativeStats = {
  cumlativeStats: Vue.component("season-stats", {
    props: ["props_player_id"],
    data: function() {
      return {
        playerCumStats: {}
      };
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
        }).then(function(response) {
          this.playerCumStats = response;
          console.log(this.playerCumStats);
        });
      }
    },
    template: `
      <tr class="d-flex">
        <td @click="retrievePlayerStats(props_player_id)" class="col-4 justify-content-center" scope="row">
            Season Stats</td>
        </td>
        <td class="col-2 justify-content-center" justify-content="center">
            166</td>
        <td class="col-2 justify-content-center">22</td>
        <td class="col-2 justify-content-center">55</td>
        <td class="col-2 justify-content-center">88</td>
      </tr>
    ` // End template
  })
};

module.exports = { playerCumlativeStats };
