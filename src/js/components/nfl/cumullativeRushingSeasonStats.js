const Vue = require("vue");
const axios = require("axios");
const date = require("../../modules/todayDate");

const { EventBus } = require("../../modules/event-bus");

const rushingCumulativeStats = {
  cumulativeStats: Vue.component("rushing-season-stats", {
    props: ["props_player_id"],
    data: function() {
      return {
        rushAttempts: "",
        rushYards: "",
        rushAvg: "",
        rushTD: "",
        rushLong: "",
        receptions: "",
        showComponent: false,
        loading: false
      };
    },
    mounted: function() {
      EventBus.$on(
        "showRushingTemplateClicked",
        this.onShowRushingTemplateClicked
      );
    },
    methods: {
      onShowRushingTemplateClicked: function(playerId) {
        if (playerId === this.props_player_id) {
          this.loading = true;
          this.showComponent = !this.showComponent;
          this.retrieveRushingStats(playerId);
        }
      },
      retrieveRushingStats: function(playerId) {
        let seasonName = `${date.year}-regular`;
        const url = `https://api.mysportsfeeds.com/v1.2/pull/nfl/${seasonName}/cumulative_player_stats.json?player=`;
        const params = {
          playerstats: "Att,Pct,Yds,Int,TD,Avg,Lng,Rec",
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
          this.rushAttempts =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.RushAttempts[
              "#text"
            ];
          this.rushYards =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.RushYards[
              "#text"
            ];
          this.rushAvg =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.RushAverage[
              "#text"
            ];
          this.rushTD =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.RushTD[
              "#text"
            ];
          this.rushLong =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.RushLng[
              "#text"
            ];
          this.receptions =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.Receptions[
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
                <th class="col-2 justify-content-center season-stats-headers" scope="col">Att</th>
                <th class="col-2 justify-content-center season-stats-headers" scope="col">Yds</th>
                <th class="col-2 justify-content-center season-stats-headers" scope="col">Avg</th>
                <th class="col-2 justify-content-center season-stats-headers" scope="col">TD</th>
                <th class="col-2 justify-content-center season-stats-headers" scope="col">Lng</th>
                <th class="col-2 justify-content-right season-stats-headers" scope="col">Rec</th>
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
                {{ rushAttempts }} </td>
                <td class="col-2 justify-content-center">{{ rushYards }}</td>
                <td class="col-2 justify-content-center"> {{ rushAvg }}</td>
                <td class="col-2 justify-content-center"> {{ rushTD }}</td>
                <td class="col-2 justify-content-center"> {{ rushLong }}</td>
                <td class="col-2 justify-content-center">{{ receptions }}</td>
            </tr>
          </transition>
        </div>
    `
  })
};

module.export = { rushingCumulativeStats };
