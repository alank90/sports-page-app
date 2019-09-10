const Vue = require("vue");
const axios = require("axios");

const { EventBus } = require("../modules/event-bus");

const pitcherCumulativeStats = {
  cumlativeStats: Vue.component("pitcher-season-stats", {
    props: ["props_player_id"],
    data: function() {
      return {
        Wins: "",
        Losses: "",
        IP: "",
        SO: "",
        ERA: "",
        showComponent: false
      };
    },
    mounted: function() {
      EventBus.$on(
        "showPitcherTemplateClicked",
        this.onShowPitcherTemplateClicked
      );
    },
    methods: {
      onShowPitcherTemplateClicked: function(playerId) {
        if (playerId === this.props_player_id) {
          this.showComponent = !this.showComponent;
        }
      },
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
        <div>
          <tr class="d-flex header-row" v-if="showComponent">
              <th class="col-2 justify-content-center season-stats-headers"  scope="col" @click="retrievePitcherStats(props_player_id)">
              Season</th>
              <th class="col-2 justify-content-center season-stats-headers" scope="col">Wins</th>
              <th class="col-2 justify-content-center season-stats-headers" scope="col">Losses</th>
              <th class="col-2 justify-content-center season-stats-headers" scope="col">SO</th>
              <th class="col-2 justify-content-center season-stats-headers" scope="col">IP</th>
              <th class="col-2 justify-content-right season-stats-headers" scope="col">ERA</th>
          </tr>
          <tr class="d-flex" v-if="showComponent">
              <td class="col-2 justify-content-center season-stats" justify-content="center"></td>
              <td class="col-2 justify-content-center season-stats" justify-content="center">
              {{ Wins }}</td>
              <td class="col-2 justify-content-center season-stats">{{ Losses }}</td>
              <td class="col-2 justify-content-center season-stats"> {{ SO }}</td>
              <td class="col-2 justify-content-center season-stats"> {{ IP }}</td>
              <td class="col-2 justify-content-center season-stats">{{ ERA }}</td>
          </tr>
        </div>
    ` // End template
  })
};

module.exports = { pitcherCumulativeStats };
