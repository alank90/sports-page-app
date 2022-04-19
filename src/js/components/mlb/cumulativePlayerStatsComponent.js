const Vue = require("vue");
const axios = require("axios");
const date = require("../../modules/todayDate");

const { EventBus } = require("../../modules/event-bus");

const playerCumulativeStats = {
  cumlativeStats: Vue.component("player-season-stats", {
    props: ["props_player_id"],
    data: function() {
      return {
        Hits: "",
        HR: "",
        RBI: "",
        BattingAvg: "",
        showComponent: false,
        loading: false
      };
    },
    mounted: function() {
      EventBus.$on(
        "showPlayerTemplateClicked",
        this.onShowPlayerTemplateClicked
      );
    },
    methods: {
      onShowPlayerTemplateClicked: function(playerId) {
        if (playerId === this.props_player_id) {
          this.loading = true;
          this.showComponent = !this.showComponent;
          this.retrievePlayerStats(playerId);
        }
      },
      retrievePlayerStats: function(playerId) {
        let seasonName = `${date.year}-regular`;
        const url = `https://api.mysportsfeeds.com/v1.2/pull/mlb/${seasonName}/cumulative_player_stats.json?player=`;
        const params = {
          playerstats: "AB,H,HR,RBI,AVG",
          force: true
        };

        axios({
          method: "get",
          headers: {
            Authorization:
              "Basic OWU3OTk3NGYtOGM1NS00YjVlLWIyODgtMTU0MWM0OnNwb3J0c2ZlZWRzMjAxOA=="
          },
          url: url + playerId,
          params: params
        }).then(response => {
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

          this.loading = false;
        });
      }
    },
    template: `
      <transition name="fade">
        <tr class="d-flex flex-wrap season-stats" v-if="showComponent">
          <span class="cumlativeStatsLoading" v-if="loading">
          Loading
          <!-- below is our font awesome icon with the class “spin-it” where 
              we have set the infinite animation:                        -->
            <i class="fas fa-cog spin-it fa-sm" aria-hidden="true"></i>
          </span>
          <td  v-if="!loading" class="col-4 justify-content-center" scope="row">
              Season Stats</td>
          </td>
          <td class="col-2 justify-content-center" justify-content="center">
            {{ Hits }}</td>
          <td class="col-2 justify-content-center">{{ HR }}</td>
          <td class="col-2 justify-content-center"> {{ BattingAvg }}</td>
          <td class="col-2 justify-content-center">{{ RBI }}</td>
        </tr>
      </transition>
      
    ` // End template
  })
};

module.exports = { playerCumulativeStats };
