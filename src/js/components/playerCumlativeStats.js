const Vue = require("vue");
const { EventBus } = require("../modules/event-bus");

const playerCumlativeStats = {
  playerCumlativeStats: Vue.component("mlb-player-stats", {
    data() {
      return {
        boxGameScores: []
      };
    },
    mounted() {
      EventBus.$on("boxGameScores", data => {
        // Assign data on eventBus to this component
        this.boxGameScores = data;
      });
    },
    template: `
    <tr class="d-flex">
    <td class="col-4 justify-content-center" scope="row">
        Test Name</td>
    </td>
    <td class="col-2 justify-content-center" justify-content="center">
        166</td>
    <td class="col-2 justify-content-center">22</td>
    <td class="col-2 justify-content-center">55</td>
    <td class="col-2 justify-content-center">88
    </td>
</tr>

    `
  })
};

module.exports = { playerCumlativeStats };
