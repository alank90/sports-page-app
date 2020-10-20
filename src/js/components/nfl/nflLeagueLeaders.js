// src/js/components/nflLeagueLeaders.js
const Vue = require("vue");

const leagueLeaders = {
  leaders: Vue.component("league-leaders", {
    template: `
     <h2>League Leaders Go Here</h2>
    
    `, // End of Template
    data: function () {
      return {
        test: "testing",
      };
    },
  }),
};

module.exports = { leagueLeaders };
