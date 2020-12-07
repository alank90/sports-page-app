const Vue = require("vue");
const seasonDates = require("../../modules/seasonDates");
const date = require("../../modules/todayDate");

const mlbLeagueLeaders = Vue.component("mlbLeagueLeaders", {
  template: `
    <div v-if="end_of_season === true">
        <h2> End of Baseball Season. See Ya in April!!!</h2>
    </div>
    <div v-else>   
        <p>This is a test route. MLB league leaders will go here. Thanks!</p>
    </div>    

    `,
  data: function () {
    return {
      end_of_season: false,
    };
  },
  mounted: function () {
    if (date.today >= seasonDates.mlb.regularSeasonEndDate) {
      this.end_of_season = true;
    }
  },
});

module.exports = mlbLeagueLeaders;
