// src/js/components/nflLeagueLeaders.js
const Vue = require("vue");
const getLeagueLeaders = require("../../modules/getLeagueLeaders");

const leagueLeaders = {
  leaders: Vue.component("league-leaders", {
    template: `
     <h2>League Leaders Go Here</h2>
    
    `, // End of Template
    data: function () {
      return {
        qbLeaders: {},
        fetchQbUrl:
          "https://api.mysportsfeeds.com/v1.2/pull/nfl/2020-2021-regular/cumulative_player_stats.json?",
        params: {
          teamstats: "none",
          playerstats: "Att,Comp,Yds,Rec,TD",
          position: "qb",
          sort: "stats.Yds.D",
          limit: 10,
          force: true,
        },
      };
    },
    mounted: async function () {
      this.qbLeaders = await getLeagueLeaders(this.fetchQbUrl, this.params);
      console.log("qBLeaders is %s", this.qbLeaders);
    },
  }),
};

module.exports = { leagueLeaders };
