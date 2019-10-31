const Vue = require("vue");
const axios = require("axios");

const { EventBus } = require("../../modules/event-bus");

const nbaPlayerCumulativeStats = {
  cumulativeStats: Vue.component("nba-player-season-stats", {
    props: ["props_player_id"],
    data: function() {
      return {
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
        console.log(playerId);
      }
    },
    template: `
        <div v-if="showComponent">
            <transition name="fade">
                <p>NBA SeasonStats Here </p>

            </transition>

        </div>
    
    ` // End Component Template
  })
};

module.export = { nbaPlayerCumulativeStats };
