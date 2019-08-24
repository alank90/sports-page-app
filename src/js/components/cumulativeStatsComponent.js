const Vue = require("vue");
const axios = require("axios");

const playerCumulativeStats = {
  cumlativeStats: Vue.component("season-stats", {
    props: ["props_player_id"],
    data: function() {
      return {
        Hits: "",
        HR: "",
        RBI: "",
        BattingAvg: ""
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
        }).then(response => {
          console.log(
            response.data.cumulativeplayerstats.playerstatsentry[0].stats
          );
          this.Hits =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.Hits[
              "#text"
            ];
          this.HR =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.Homeruns[
              "#text"
            ];
          this.BattingAvg = response.data.cumulativeplayerstats.playerstatsentry[0].stats.BattingAvg[
            "#text"
          ].substring(1);
          this.RBI =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.RunsBattedIn[
              "#text"
            ];
        });
      }
    },
    template: `
      <tr class="d-flex">
        <td @click="retrievePlayerStats(props_player_id)" class="col-4 justify-content-center" scope="row">
            Season Stats</td>
        </td>
        <td class="col-2 justify-content-center" justify-content="center">
          {{ Hits }}</td>
        <td class="col-2 justify-content-center">{{ HR }}</td>
        <td class="col-2 justify-content-center"> {{ BattingAvg }}</td>
        <td class="col-2 justify-content-center">{{ RBI }}</td>
      </tr>
    ` // End template
  })
};

module.exports = { playerCumulativeStats };
