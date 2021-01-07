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
                <th scope="col" class="col-3">Player</th>
                <th scope="col" class="col-1">GP</th>
                <th scope="col" class="col-2">FGA/G</th>
                <th scope="col" class="col-2">FGM/G</th>
                <th scope="col" class="col-2">FG %</th>
                <th scope="col" class="col-2">PTS</th>
              </tr>
            </thead>

            <tbody>
              <div
                v-for="(scorers, index) in filteredStatsLeaders(scoringLeaders.cumulativeplayerstats
                  .playerstatsentry)"
              >
                <tr class="d-flex justify-content-around">
                  <td class="col-3">
                    {{scorers.player.FirstName + " " + scorers.player.LastName
                    + " (" + scorers.team.Abbreviation + ")"}}
                  </td>
                  <td class="col-1">
                    {{scorers.stats.GamesPlayed["#text"]}}
                  </td>
                  <td class="col-2">
                    {{scorers.stats.FgAttPerGame["#text"]}}
                  </td>
                  <td class="col-2">
                    {{scorers.stats.FgMadePerGame["#text"]}}
                  </td>
                  <td class="col-2">
                    {{scorers.stats.FgPct["#text"]}}
                  </td>
                  <td class="col-2">
                    {{scorers.stats.PtsPerGame["#text"]}}
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
                <th scope="col" class="col-7">Player</th>
                <th scope="col" class="col-2">GP</th>
                <th scope="col" class="col-3">Assists</th>
              </tr>
            </thead>

            <tbody>
              <div
                v-for="(assists, index) in filteredStatsLeaders(assistsLeaders.cumulativeplayerstats
                  .playerstatsentry)"
              >
                <tr class="d-flex justify-content-around">
                  <td class="col-7">
                    {{assists.player.FirstName + " " + assists.player.LastName
                    + " (" + assists.team.Abbreviation + ")"}}
                  </td>
                  <td class="col-2">
                    {{assists.stats.GamesPlayed["#text"]}}
                  </td>
                  <td class="col-3">
                    {{assists.stats.AstPerGame["#text"]}}
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
                <th scope="col" class="col-4">Player</th>
                <th scope="col" class="col-2">GP</th>
                <th scope="col" class="col-2">3's Att</th>
                <th scope="col" class="col-2">3's Made</th>
                <th scope="col" class="col-2">3-Pt %</th>
              </tr>
            </thead>

            <tbody>
              <div
                v-for="(threePtr, index) in filteredStatsLeaders(threePtsMadeLeaders.cumulativeplayerstats
                  .playerstatsentry)"
              >
                <tr class="d-flex justify-content-around">
                  <td class="col-4">
                    {{threePtr.player.FirstName + " " + threePtr.player.LastName
                    + " (" + threePtr.team.Abbreviation + ")"}}
                  </td>
                  <td class="col-2">
                    {{threePtr.stats.GamesPlayed["#text"]}}
                  </td>
                  <td class="col-2">
                    {{threePtr.stats.Fg3PtAttPerGame["#text"]}}
                  </td>
                  <td class="col-2">
                    {{threePtr.stats.Fg3PtMadePerGame["#text"]}}
                  </td>
                  <td class="col-2">
                    {{threePtr.stats.Fg3PtPct["#text"]}}
                  </td>
                </tr>
              </div>
            </tbody>
          </table>
        </div>
      </div>  <!-- End of row -->

      <!-- ============= Defensive Leaders ==================================================== -->
      <h2><u>Defensive Leaders</u></h2>
      <div class="row">
        <div class="col-sm">
          <h3>Top Rebounders</h3>
          <table v-if="reboundLeaders.cumulativeplayerstats" class="table table-striped table-sm table-hover">
            <thead class="thead-dark">
              <tr class="d-flex">
                <th scope="col" class="col-6">Player</th>
                <th scope="col" class="col-3">GP</th>
                <th scope="col" class="col-3">Reb/G</th>
              </tr>
            </thead>

            <tbody>
              <div
                v-for="(rebounder, index) in filteredStatsLeaders(reboundLeaders.cumulativeplayerstats
                  .playerstatsentry)"
              >
                <tr class="d-flex justify-content-around">
                  <td class="col-6">
                    {{rebounder.player.FirstName + " " + rebounder.player.LastName
                    + " (" + rebounder.team.Abbreviation + ")"}}
                  </td>
                  <td class="col-3">
                    {{rebounder.stats.GamesPlayed["#text"]}}
                  </td>
                  <td class="col-3">
                    {{rebounder.stats.RebPerGame["#text"]}}
                  </td>
                </tr>
              </div>
            </tbody>
          </table>
        </div>

        <div class="col-sm">
          <h3>Top Blockers</h3>
          <table v-if="blockLeaders.cumulativeplayerstats" class="table table-striped table-sm table-hover">
            <thead class="thead-dark">
              <tr class="d-flex">
                <th scope="col" class="col-6">Player</th>
                <th scope="col" class="col-3">GP</th>
                <th scope="col" class="col-3">Blks/G</th>
              </tr>
            </thead>

            <tbody>
              <div
                v-for="(block, index) in filteredStatsLeaders(blockLeaders.cumulativeplayerstats
                  .playerstatsentry)"
              >
                <tr class="d-flex justify-content-around">
                  <td class="col-6">
                    {{block.player.FirstName + " " + block.player.LastName
                    + " (" + block.team.Abbreviation + ")"}}
                  </td>
                  <td class="col-3">
                    {{block.stats.GamesPlayed["#text"]}}
                  </td>
                  <td class="col-3">
                    {{block.stats.BlkPerGame["#text"]}}
                  </td>
                </tr>
              </div>
            </tbody>
          </table>
        </div>

        <div class="col-sm">
          <h3>Steals/Game Leaders</h3>
          <table v-if="stealLeaders.cumulativeplayerstats" class="table table-striped table-sm table-hover">
            <thead class="thead-dark">
              <tr class="d-flex">
                <th scope="col" class="col-6">Player</th>
                <th scope="col" class="col-3">GP</th>
                <th scope="col" class="col-3">Stl/G</th>
              </tr>
            </thead>

            <tbody>
              <div
                v-for="(steal, index) in filteredStatsLeaders(stealLeaders.cumulativeplayerstats
                  .playerstatsentry)"
              >
                <tr class="d-flex justify-content-around">
                  <td class="col-6">
                    {{steal.player.FirstName + " " + steal.player.LastName
                    + " (" + steal.team.Abbreviation + ")"}}
                  </td>
                  <td class="col-3">
                    {{steal.stats.GamesPlayed["#text"]}}
                  </td>
                  <td class="col-3">
                    {{steal.stats.StlPerGame["#text"]}}
                  </td>
                </tr>
              </div>
            </tbody>
          </table>
        </div>
      </div> <!-- End .row -->

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
      reboundLeaders: {},
      blockLeaders: {},
      stealLeaders: {},
      nbaGamesPlayed: 0,
      fetchGamesPlayedUrl:
        "https://api.mysportsfeeds.com/v1.2/pull/nba/2020-2021-regular/overall_team_standings.json?limit=1&playerstats=G",
      nbaGamesPlayedParams: [
        {
          teamstats: "none",
          limit: "1",
          playerstats: "G",
        },
      ],
      fetchBaseUrl:
        "https://api.mysportsfeeds.com/v1.2/pull/nba/2020-2021-regular/cumulative_player_stats.json?",
      params: [
        {
          teamstats: "none",
          playerstats: "PTS,PTS/G,FGA/G,FGM/G,FG%",
          sort: "stats.PTS/G.D",
          limit: 15,
          force: true,
        },
        {
          teamstats: "none",
          playerstats: "AST/G",
          sort: "stats.AST/G.D",
          limit: 15,
          force: true,
        },
        {
          teamstats: "none",
          playerstats: "3PM/G,3PA/G,3P%",
          sort: "stats.3PM/G.D",
          limit: 15,
          force: true,
        },
        {
          teamstats: "none",
          playerstats: "REB/G",
          sort: "stats.REB/G.D",
          limit: 15,
          force: true,
        },
        {
          teamstats: "none",
          playerstats: "BS/G",
          sort: "stats.BS/G.D",
          limit: 15,
          force: true,
        },
        {
          teamstats: "none",
          playerstats: "STL/G",
          sort: "stats.STL/G.D",
          limit: 15,
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
      this.assistsLeaders = leagueLeadersResponseArray[1];
      this.threePtsMadeLeaders = leagueLeadersResponseArray[2];
      this.reboundLeaders = leagueLeadersResponseArray[3];
      this.blockLeaders = leagueLeadersResponseArray[4];
      this.stealLeaders = leagueLeadersResponseArray[5];

      // Need # of league games played for statsleaders to apply a minumum amount of games
      // played to the listing
      if (this.$root.standings[0]) {
        this.nbaGamesPlayed = this.$root.standings[0].teamentry[0].stats.GamesPlayed[
          "#text"
        ];
      } else {
        const temp = await getLeagueLeaders(
          this.fetchGamesPlayedUrl,
          this.nbaGamesPlayedParams
        );

        this.nbaGamesPlayed =
          temp[0].overallteamstandings.teamstandingsentry[0].stats.GamesPlayed[
            "#text"
          ];
      }

      this.loading = false;
    }
  },
  methods: {
    filteredStatsLeaders: function (leadersArray) {
      const minGamesPlayed = Math.round(this.nbaGamesPlayed * 0.6);

      const result = leadersArray
        .filter((scorer) => scorer.stats.GamesPlayed["#text"] > minGamesPlayed)
        .slice(0, 10);

      return result;
    },
  },
});

module.exports = nbaLeagueLeaders;
