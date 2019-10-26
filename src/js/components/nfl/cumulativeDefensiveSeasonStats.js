const Vue = require("vue");
const axios = require("axios");

const { EventBus } = require("../../modules/event-bus");

const defensiveCumulativeStats = {
  cumulativeStats: Vue.component("defensive-season-stats", {
    props: ["props_player_id"],
    data: function() {
      return {
        totalTackles: "",
        soloTackles: "",
        sacks: "",
        interceptions: "",
        forcedFumbles: "",
        stuffs: "",
        showComponent: false,
        loading: false
      };
    },
    mounted: function() {
      EventBus.$on(
        "showDefensiveTemplateClicked",
        this.onShowDefensiveTemplateClicked
      );
    },
    methods: {
      onShowDefensiveTemplateClicked: function(playerId) {
        if (playerId === this.props_player_id) {
          console.log(playerId);
          this.loading = true;
          this.showComponent = !this.showComponent;
          this.retrieveDefensiveStats(playerId);
        }
      },
      retrieveDefensiveStats: function(playerId) {
        const url = `https://api.mysportsfeeds.com/v1.2/pull/nfl/2019-regular/cumulative_player_stats.json?player=`;
        const params = {
          playerstats: "Total,Solo,Sacks,Int,Forced,Stuffs",
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
          this.totalTackles =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.TackleTotal[
              "#text"
            ];
          this.soloTackles =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.TackleSolo[
              "#text"
            ];
          this.sacks =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.Sacks[
              "#text"
            ];
          this.interceptions =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.Interceptions[
              "#text"
            ];
          this.forcedFumbles =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.FumForced[
              "#text"
            ];
          this.stuffs =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.Stuffs[
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
                  <th class="col-2 justify-content-center season-stats-headers" scope="col">Tkls</th>
                  <th class="col-2 justify-content-center season-stats-headers" scope="col">Solo</th>
                  <th class="col-2 justify-content-center season-stats-headers" scope="col">Sks</th>
                  <th class="col-2 justify-content-center season-stats-headers" scope="col">Int</th>
                  <th class="col-2 justify-content-center season-stats-headers" scope="col">FF</th>
                  <th class="col-2 justify-content-right season-stats-headers" scope="col">Stff</th>
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
                  {{ totalTackles }}</td>
                  <td class="col-2 justify-content-center">{{ soloTackles }}</td>
                  <td class="col-2 justify-content-center"> {{ sacks }}</td>
                  <td class="col-2 justify-content-center"> {{ interceptions }}</td>
                  <td class="col-2 justify-content-center"> {{ forcedFumbles }}</td>
                  <td class="col-2 justify-content-center">{{ stuffs }}</td>
              </tr>
            </transition>
          </div>
      `
  })
};

module.export = { defensiveCumulativeStats };
