const Vue = require("vue");
const axios = require("axios");

const { EventBus } = require("../../modules/event-bus");

const qbCumulativeStats = {
  cumulativeStats: Vue.component("qb-season-stats", {
    props: ["props_player_id"],
    data: function() {
      return {
        passCompletions: "",
        passAttempts: "",
        passPct: "",
        passYards: "",
        passInt: "",
        passTD: "",
        showComponent: false,
        loading: false
      };
    },
    mounted: function() {
      EventBus.$on("showQBTemplateClicked", this.onShowQBTemplateClicked);
    },
    methods: {
      onShowQBTemplateClicked: function(playerId) {
        if (playerId === this.props_player_id) {
          console.log(playerId);
          this.loading = true;
          this.showComponent = !this.showComponent;
          this.retrieveQBStats(playerId);
        }
      },
      retrieveQBStats: function(playerId) {
        const url = `https://api.mysportsfeeds.com/v1.2/pull/nfl/2019-regular/cumulative_player_stats.json?player=`;
        const params = {
          playerstats: "Comp,Att,Pct,Yds,Int,TD",
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
          this.passCompletions =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.PassCompletions[
              "#text"
            ];
          this.passAttempts =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.PassAttempts[
              "#text"
            ];
          this.passPct =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.PassPct[
              "#text"
            ];
          this.passYards =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.PassYards[
              "#text"
            ];
          this.passTD =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.PassTD[
              "#text"
            ];
          this.passInt =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.PassInt[
              "#text"
            ];

          this.loading = false;
        });
      }
    },
    template: `
        <div>
          <transition name="fade">
            <tr class="d-flex header-row" v-if="showComponent">
              <th class="col-2 justify-content-center season-stats-headers"  scope="col" @click="retrieveQBStats(props_player_id)">
              Season</th>
              <th class="col-3 justify-content-center season-stats-headers" scope="col">Cmp/Att</th>
              <th class="col-2 justify-content-center season-stats-headers" scope="col">Pct</th>
              <th class="col-2 justify-content-center season-stats-headers" scope="col">Yds</th>
              <th class="col-1 justify-content-center season-stats-headers" scope="col">TD</th>
              <th class="col-2 justify-content-right season-stats-headers" scope="col">Int</th>
            </tr>
          </transition>
        </div>
    `
  })
};

module.export = { qbCumulativeStats };
