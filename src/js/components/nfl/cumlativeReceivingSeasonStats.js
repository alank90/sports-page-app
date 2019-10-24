const Vue = require("vue");
const axios = require("axios");

const { EventBus } = require("../../modules/event-bus");

const receivingCumulativeStats = {
  cumulativeStats: Vue.component("receiving-season-stats", {
    props: ["props_player_id"],
    data: function() {
      return {
        receptions: "",
        targets: "",
        receivingYards: "",
        averagePerReception: "",
        receivingTD: "",
        receptionLong: "",
        showComponent: false,
        loading: false
      };
    },
    mounted: function() {
      EventBus.$on(
        "showReceivingTemplateClicked",
        this.onShowReceivingTemplateClicked
      );
    },
    methods: {
      onShowReceivingTemplateClicked: function(playerId) {
        if (playerId === this.props_player_id) {
          console.log(playerId);
          this.loading = true;
          this.showComponent = !this.showComponent;
          this.retrieveReceivingStats(playerId);
        }
      },
      retrieveReceivingStats: function(playerId) {
        const url = `https://api.mysportsfeeds.com/v1.2/pull/nfl/2019-regular/cumulative_player_stats.json?player=`;
        const params = {
          playerstats: "Rec,Tgt,Yds,Avg,TD,Lng",
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
          this.receptions =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.Receptions[
              "#text"
            ];
          this.targets =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.Targets[
              "#text"
            ];
          this.receivingYards =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.RecYards[
              "#text"
            ];
          this.averagePerReception =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.RecAverage[
              "#text"
            ];
          this.receivingTD =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.RecTD[
              "#text"
            ];
          this.receptionLong =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.RecLng[
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
                <th class="col-2 justify-content-center season-stats-headers" scope="col">Rec</th>
                <th class="col-2 justify-content-center season-stats-headers" scope="col">Tgts</th>
                <th class="col-2 justify-content-center season-stats-headers" scope="col">Yds</th>
                <th class="col-2 justify-content-center season-stats-headers" scope="col">Avg</th>
                <th class="col-2 justify-content-center season-stats-headers" scope="col">TD</th>
                <th class="col-2 justify-content-right season-stats-headers" scope="col">Lng</th>
            </thead>
          </transition>

          <transition name="fade">
            <tr class="d-flex flex-wrap">
                <span class="cumlativeStatsLoading" v-if="loading">
                Loading
                <!-- below is our font awesome icon with the class “spin-it” where 
                    we have set the infinite animation:                        -->
                  <i class="fas fa-cog spin-it fa-sm" aria-hidden="true"></i>
                </span>
                <td class="col-2 justify-content-center season-stats" justify-content="center">
                {{ receptions }}</td>
                <td class="col-2 justify-content-center season-stats">{{ targets }}</td>
                <td class="col-2 justify-content-center season-stats"> {{ receivingYards }}</td>
                <td class="col-2 justify-content-center season-stats"> {{ averagePerReception }}</td>
                <td class="col-2 justify-content-center season-stats"> {{ receivingTD }}</td>
                <td class="col-2 justify-content-center season-stats">{{ receptionLong }}</td>
            </tr>
          </transition>
        </div>
    `
  })
};

module.export = { receivingCumulativeStats };
