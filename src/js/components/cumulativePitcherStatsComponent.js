const Vue = require("vue");
const axios = require("axios");

const pitcherCumulativeStats = {
  cumlativeStats: Vue.component("pitcher-season-stats", {
    props: ["props_player_id"],
    data: function() {
      return {
        Wins: "",
        Losses: "",
        IP: "",
        SO: "",
        ERA: ""
      };
    },
    methods: {
      retrievePitcherStats: function(playerId) {
        const url = `https://api.mysportsfeeds.com/v1.2/pull/mlb/2019-regular/cumulative_player_stats.json?player=`;
        const params = {
          playerstats: "W,L,SO,IP,ERA",
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
          this.Wins =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.Wins[
              "#text"
            ];
          this.Losses =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.Losses[
              "#text"
            ];
          this.IP =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.InningsPitched[
              "#text"
            ];
          this.ERA =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.EarnedRunAvg[
              "#text"
            ];
          this.SO =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.PitcherStrikeouts[
              "#text"
            ];
        });
      }
    },
    template: `
        <tr class="d-flex">
            <td @click="retrievePitcherStats(props_player_id)" class="col-2 justify-content-center" scope="row">
            Click</td>
            </td>
            <td class="col-2 justify-content-center" justify-content="center">
            {{ Wins }}</td>
            <td class="col-2 justify-content-center">{{ Losses }}</td>
            <td class="col-2 justify-content-center"> {{ SO }}</td>
            <td class="col-2 justify-content-center"> {{ IP }}</td>
            <td class="col-2 justify-content-center">{{ ERA }}</td>
        </tr>
    ` // End template
  })
};

module.exports = { pitcherCumulativeStats };
