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
        fetchURL:
          "https://api.mysportsfeeds.com/v1.2/pull/nfl/2020-2021-regular/cumulative_player_stats.json",
          params = {
            teamstats: "none",
            playerstats:
              "Att,Comp,Yds,Rec,TD",
            position: "qb",
            sort: "stats.Yds",
            limit: 10,
            force: true,
          }
      
        };
    },
    methods: {
      retrieveTopOffensivePlayers: function () {
        fetch(fetchURL, {
          method: "get",
          headers: {
            Authorization:
              "Basic NzAxMzNkMmEtNzVmMi00MjdiLWI5ZDYtOTgyZTFhOnNwb3J0c2ZlZWRzMjAxOA==",
          },
          params: this.params,
        });
      },
    },
  }),
};

module.exports = { leagueLeaders };
