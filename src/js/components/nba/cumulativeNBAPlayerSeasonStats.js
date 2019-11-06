const Vue = require("vue");
const axios = require("axios");
const seasonDates = require("../../modules/seasonDates");

const { EventBus } = require("../../modules/event-bus");

const nbaPlayerCumulativeStats = {
  cumulativeStats: Vue.component("nba-player-season-stats", {
    props: ["props_player_id"],
    data: function() {
      return {
        pPG: "",
        rPG: "",
        aPG: "",
        fgPct: "",
        threePtMade: "",
        showComponent: false,
        loading: false
      };
    },
    mounted: function() {
      EventBus.$on(
        "showNBAPlayerclicked",
        this.onShowNBAPlayerSeasonStatsClicked
      );
    },
    methods: {
      onShowNBAPlayerSeasonStatsClicked: function(playerId) {
        if (playerId === this.props_player_id) {
          this.loading = true;
          this.showComponent = !this.showComponent;
          this.retrievePlayerStats(playerId);
        }
      },
      retrievePlayerStats: function(playerId) {
        let seasonName = `${seasonDates.nba.regularSeasonYear}-${+seasonDates
          .nba.regularSeasonYear + 1}-regular`;
        const url = ` https://api.mysportsfeeds.com/v1.2/pull/nba/${seasonName}/cumulative_player_stats.json?player=`;
        const params = {
          playerstats: "PTS/G,REB/G,AST/G,FG%,3PM",
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
          this.pPG =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.PtsPerGame[
              "#text"
            ];
          this.rPG =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.RebPerGame[
              "#text"
            ];
          this.aPG =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.AstPerGame[
              "#text"
            ];
          this.fgPct =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.FgPct[
              "#text"
            ];
          this.threePtMade =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.Fg3PtMade[
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
                  <th class="col-2 justify-content-center season-stats-headers" scope="col">PPG</th>
                  <th class="col-2 justify-content-center season-stats-headers" scope="col">RPG</th>
                  <th class="col-2 justify-content-center season-stats-headers" scope="col">APG</th>
                  <th class="col-3 justify-content-center season-stats-headers" scope="col">FGPCT</th>
                  <th class="col-3 justify-content-center season-stats-headers" scope="col">3PTR</th>
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
                  {{pPG }}</td>
                  <td class="col-2 justify-content-center">{{ rPG }}</td>
                  <td class="col-2 justify-content-center"> {{ aPG }}</td>
                  <td class="col-3 justify-content-center"> {{ fgPct }}</td>
                  <td class="col-3 justify-content-center"> {{ threePtMade }}</td>
              </tr>
            </transition>
        </div>
    
    ` // End Component Template
  })
};

module.export = { nbaPlayerCumulativeStats };
