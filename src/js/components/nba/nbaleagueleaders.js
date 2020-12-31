const Vue = require("vue");
const seasonDates = require("../../modules/seasonDates");
const getLeagueLeaders = require("../../modules/getLeagueLeaders");
const date = require("../../modules/todayDate");

const nbaLeagueLeaders = Vue.component("nbaLeagueLeaders", {
  template: `
  <div class="container">
  <div v-if="end_of_season === true">
    <h2>End of BasketBall Season. See Ya in November!!!</h2>
  </div>
  <!-- ============ Begin Markup for Stats Leaders ========== -->
  <section v-else-if="!end_of_season">
    <h1>NBA League Leaders</h1>
    <hr />

    <div class="container">
    <h2><u>Offensive Leaders</u></h2>
      <div class="row">
        <div class="col-sm">
          <h3>Top Scorers</h3>
          <table v-if="scoringLeaders.cumulativeplayerstats" class="table table-striped table-sm table-hover">
            <thead class="thead-dark">
              <tr class="d-flex">
                <th scope="col" class="col-6">Player</th>
                <th scope="col" class="col-3">FGA/G</th>
                <th scope="col" class="col-3">PTS</th>
              </tr>
            </thead>

            <tbody>
              <div
                v-for="(scorer, index) in scoringLeaders.cumulativeplayerstats.playerstatsentry"
              >
                <tr class="d-flex justify-content-around">
                  <td class="col-6">
                    {{scorer.player.FirstName + " " + scorer.player.LastName
                    + " (" + scorer.team.Abbreviation + ")"}}
                  </td>
                  <td class="col-3">
                    {{scorer.stats.FgAttPerGame["#text"]}}
                  </td>
                  <td class="col-3">
                    {{scorer.stats.PtsPerGame["#text"]}}
                  </td>
                </tr>
              </div>
            </tbody>
          </table>
        </div>

        <div class="col-sm">
          <h3>Assists Leaders</h3>
          <table v-if="assistsLeaders.cumulativeplayerstats" class="table table-striped table-sm table-hover">
            <thead class="thead-dark">
              <tr class="d-flex">
                <th scope="col" class="col-9">Player</th>
                <th scope="col" class="col-3">Assists</th>
              </tr>
            </thead>

            <tbody>
              <div
                v-for="(scorer, index) in assistsLeaders.cumulativeplayerstats.playerstatsentry"
              >
                <tr class="d-flex justify-content-around">
                  <td class="col-9">
                    {{scorer.player.FirstName + " " + scorer.player.LastName
                    + " (" + scorer.team.Abbreviation + ")"}}
                  </td>
                  <td class="col-3">
                    {{scorer.stats.AstPerGame["#text"]}}
                  </td>
                </tr>
              </div>
            </tbody>
          </table>
        </div>

        <div class="col-sm">
          <h3>Top 3-Pt Shooters</h3>
          <table v-if="threePtsMadeLeaders.cumulativeplayerstats" class="table table-striped table-sm table-hover">
            <thead class="thead-dark">
              <tr class="d-flex">
                <th scope="col" class="col-9">Player</th>
                <th scope="col" class="col-3">3-Ptrs</th>
              </tr>
            </thead>

            <tbody>
              <div
                v-for="(scorer, index) in threePtsMadeLeaders.cumulativeplayerstats.playerstatsentry"
              >
                <tr class="d-flex justify-content-around">
                  <td class="col-9">
                    {{scorer.player.FirstName + " " + scorer.player.LastName
                    + " (" + scorer.team.Abbreviation + ")"}}
                  </td>
                  <td class="col-3">
                    {{scorer.stats.Fg3PtMadePerGame["#text"]}}
                  </td>
                </tr>
              </div>
            </tbody>
          </table>
        </div>
      </div>  <!-- End of row -->
    </div>   <!-- End .container -->
  </section>   <!-- === End v-else-if  

<!-- --------------------------------------------------------------------- -->
  <!-- ===== Error Handling Markup for API Calls ===== -->
  <div v-else>
    <section v-if="errored">
      <p>
        We're sorry, we're not able to retrieve this information at the
        moment, please try back later
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
</div>  <!-- === End .container ===== -->
  `, // End of template
  data: function () {
    return {
      scoringLeaders: {},
      assistsLeaders: {},
      threePtsMadeLeaders: {},
      fetchBaseUrl:
        "https://api.mysportsfeeds.com/v1.2/pull/nba/2020-2021-regular/cumulative_player_stats.json?",
      params: [
        {
          teamstats: "none",
          playerstats: "PTS,PTS/G,FGA/G",
          sort: "stats.PTS/G.D",
          limit: 10,
          force: true,
        },
        {
          teamstats: "none",
          playerstats: "AST/G",
          sort: "stats.AST/G.D",
          limit: 10,
          force: true,
        },
        {
          teamstats: "none",
          playerstats: "3PM/G",
          sort: "stats.3PM/G.D",
          limit: 10,
          force: true,
        }
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
      this.assistsLeaders = leagueLeadersResponseArray[1];
      this.threePtsMadeLeaders = leagueLeadersResponseArray[2];

      this.loading = false;
    }
  },
});

module.exports = nbaLeagueLeaders;
