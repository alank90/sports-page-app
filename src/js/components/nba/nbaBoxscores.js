const Vue = require("vue");

const { EventBus } = require("../../modules/event-bus");

const nbaBoxScoresStats = {
  nbaStats: Vue.component("nba-box-scores", {
    props: ["props_box_game_scores_nba"]
  })
};

module.export = { nbaBoxScoresStats };
