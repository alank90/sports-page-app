const Vue = require("vue");
const seasonDates = require("../../modules/seasonDates");
const date = require("../../modules/todayDate");

const nbaLeagueLeaders = Vue.component("nbaLeagueLeaders", {
  template: `
    <div v-if="end_of_season === true">
        <h2> End of BasketBall Season. See Ya in November!!!</h2>
    </div>
    <div v-else>   
        <p>This is a test route. NBA league leaders will go here. Thanks!</p>
    </div>    

    `,
  data: function () {
    return {
      end_of_season: false,
    };
  },
  mounted: function () {
    if (date.today >= seasonDates.nba.regularSeasonEndDate) {
      this.end_of_season = true;
    }
  },
});

module.exports = nbaLeagueLeaders;
