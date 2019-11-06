const Vue = require("vue");
const axios = require("axios");
const date = require("../../modules/todayDate");

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
        passAvg: "",
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
          this.loading = true;
          this.showComponent = !this.showComponent;
          this.retrieveQBStats(playerId);
        }
      },
      retrieveQBStats: function(playerId) {
        let seasonName = `${date.year}-regular`;
        const url = `https://api.mysportsfeeds.com/v1.2/pull/nfl/${seasonName}/cumulative_player_stats.json?player=`;
        const params = {
          playerstats: "Comp,Att,Pct,Yds,Int,TD,Avg",
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
          this.passAvg =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.PassAvg[
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
        <div v-if="showComponent">
          <transition name="fade">
            <thead class="d-flex flex-wrap">
              <th class="col-12 stats-header"> Season Stats </th>
                <th class="col-2 justify-content-center season-stats-headers" scope="col">CP/Att</th>
                <th class="col-2 justify-content-center season-stats-headers" scope="col">Pct</th>
                <th class="col-2 justify-content-center season-stats-headers" scope="col">Yds</th>
                <th class="col-2 justify-content-center season-stats-headers" scope="col">Avg</th>
                <th class="col-2 justify-content-center season-stats-headers" scope="col">TD</th>
                <th class="col-2 justify-content-right season-stats-headers" scope="col">Int</th>
            </thead>
          </transition>

          <transition name="fade">
            <tr class="d-flex flex-wrap season-stats">
                <span class="cumlativeStatsLoading" v-if="loading">
                Loading
                <!-- below is our font awesome icon with the class “spin-it” where 
                    we have set the infinite animation:                        -->
                  <i class="fas fa-cog spin-it fa-sm" aria-hidden="true"></i>
                </span>
                <td class="col-2 justify-content-center" justify-content="center">
                {{ passCompletions }} / {{ passAttempts }}</td>
                <td class="col-2 justify-content-center">{{ passPct }}</td>
                <td class="col-2 justify-content-center"> {{ passYards }}</td>
                <td class="col-2 justify-content-center"> {{ passAvg }}</td>
                <td class="col-2 justify-content-center"> {{ passTD }}</td>
                <td class="col-2 justify-content-center">{{ passInt }}</td>
            </tr>
          </transition>
        </div>
    `
  })
};

module.export = { qbCumulativeStats };
