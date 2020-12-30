const Vue = require("vue");
const seasonDates = require("../../modules/seasonDates");
const getLeagueLeaders = require("../../modules/getLeagueLeaders");
const date = require("../../modules/todayDate");

const nbaLeagueLeaders = Vue.component("nbaLeagueLeaders", {
  template: `
    <div class="container">
        <div v-if="end_of_season === true">
            <h2> End of BasketBall Season. See Ya in November!!!</h2>
        </div>
        <!-- ============ Begin Markup for Stats Leaders ========== -->  
        <section v-else-if="!end_of_season">
            <h1>NBA League Leaders</h1>
            <hr>
            <h3> Top Scorers </h3>
              <p>This is a test route. NBA league leaders will go here. Thanks!</p>
        </section> <!-- === End v-else-if  

    <!-- --------------------------------------------------------------------- -->
        <!-- ===== Error Handling Markup for API Calls ===== -->
        <div v-else>
          <section v-if="errored">
            <p>
              We're sorry, we're not able to retrieve this information at the moment,
              please try back later
            </p>
          </section>
          <section v-else-if="loading">
            <div class="loading">
              Loading Data. Please Wait ....
              <!-- below is our font awesome icon with the class “spin-it” where 
                    we have set the infinite animation:                        -->
              <i class="fas fa-spinner spin-it" aria-hidden="true"></i>
            </div>
          </section>
          <!-- End API Error & Loading Markup -->
        </div>
        <!-- ============ End of Markup for Stats Leaders ========== --> 
    </div> <!-- === End .container ===== -->
  `, // End of template
  data: function () {
    return {
      scoringLeaders: {},
      reboundingLeaders: {},
      fetchBaseUrl:
        "https://api.mysportsfeeds.com/v1.2/pull/nba/2020-2021-regular/cumulative_player_stats.json?",
      params: [
        {
          teamstats: "none",
          playerstats: "PTS,PTS/G,REB/G,3P%,FG%,AST/G,BS/G",
          sort: "stats.PTS/G.D",
          limit: 10,
          force: true,
        },
      ],
      errored: false,
      loading: true,
      end_of_season: false,
    };
  },
  mounted: async function () {
    if (date.today >= seasonDates.nba.regularSeasonEndDate) {
      this.end_of_season = true;
    } else {
      const leagueLeadersResponseArray = await getLeagueLeaders(
        this.fetchBaseUrl,
        this.params
      );
      // Assign Vue data objects to returned responses
      this.scoringLeaders = leagueLeadersResponseArray[0]; // fetch array request element zero was the scoring leader's

      this.loading = false;
    }
  },
});

module.exports = nbaLeagueLeaders;
