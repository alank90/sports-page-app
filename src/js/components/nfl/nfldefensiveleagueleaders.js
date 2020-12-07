// src/js/components/nfloffensiveleagueleaders.js
const Vue = require("vue");
const getLeagueLeaders = require("../../modules/getLeagueLeaders");
const seasonDates = require("../../modules/seasonDates");
const date = require("../../modules/todayDate");

const nfldefensiveleagueleaders = Vue.component("nfldefensiveleagueleaders", {
  template: `
  <div class="container">
  
    <!-- ============== Markup for End of Season =============== -->
    <div v-if="end_of_season === true" class="container">
      <h3>End of Football Season. See you in the Fall</h3>
    </div>

    <section v-else-if="tacklesLeaders.cumulativeplayerstats">
      <h1>NFL League Leaders</h1>
      <hr />

      <!-- ================= Defensive Template ============================================== -------->
      <!-- =========== Defensive Markup =============================== -->

      <h3>Top Defensive Players by Tackles,Sack, and Interceptions</h3>
      <h4>Tackles</h4>
      
      <div>
        <table class="table table-striped table-sm">
          <thead>
            <tr class="d-flex">
              <th scope="col" class="col-3">Player</th>
              <th scope="col" class="col-2">Tackles</th>
              <th scope="col" class="col-1">Tackles Solo</th>
              <th scope="col" class="col-1">Tackles Asst</th>
              <th scope="col" class="col-1">Sacks</th>
              <th scope="col" class="col-1">Stuffs</th>
              <th scope="col" class="col-1">Forced Fumbles</th>
              <th scope="col" class="col-2">Int</th>
            </tr>
          </thead>

          <tbody>
            <div v-for="(tackles, index) in tacklesLeaders.cumulativeplayerstats.playerstatsentry">
              <tr class="d-flex justify-content-around">
                <td class="col-3">
                  {{tackles.player.FirstName + " " + tackles.player.LastName + " (" + tackles.team.Abbreviation + ")"}}
                </td>
                <td class="col-2">{{tackles.stats.TackleTotal["#text"]}}</td>
                <td class="col-1">{{tackles.stats.TackleSolo["#text"]}}</td>
                <td class="col-1">{{tackles.stats.TackleAst["#text"]}}</td>
                <td class="col-1">{{tackles.stats.Sacks["#text"]}}</td>
                <td class="col-1">{{tackles.stats.Stuffs["#text"]}}</td>
                <td class="col-1">{{tackles.stats.FumForced["#text"]}}</td>
                <td class="col-2">{{tackles.stats.Interceptions["#text"]}}</td>
              </tr>
            </div>
          </tbody>
        </table>
      </div>

      <h4>Sacks</h4>
      <div>
        <table class="table table-striped table-sm">
          <thead>
            <tr class="d-flex">
              <th scope="col" class="col-3">Player</th>
              <th scope="col" class="col-1">Sacks</th>
              <th scope="col" class="col-2">Tackles</th>
              <th scope="col" class="col-1">Tackles Solo</th>
              <th scope="col" class="col-1">Tackles Asst</th>
              <th scope="col" class="col-1">Stuffs</th>
              <th scope="col" class="col-1">Forced Fumbles</th>
              <th scope="col" class="col-2">Int</th>
            </tr>
          </thead>

          <tbody>
            <div v-for="(sacks, index) in sacksLeaders.cumulativeplayerstats.playerstatsentry">
              <tr class="d-flex justify-content-around">
                <td v-if="sacks.team" class="col-3">
                  {{sacks.player.FirstName + " " + sacks.player.LastName + " (" + sacks.team.Abbreviation + ")"}}
                </td>
                <td v-else class="col-3">
                  {{sacks.player.FirstName + " " + sacks.player.LastName}}
                </td>

                <td class="col-1">{{sacks.stats.Sacks["#text"]}}</td>
                <td class="col-2">{{sacks.stats.TackleTotal["#text"]}}</td>
                <td class="col-1">{{sacks.stats.TackleSolo["#text"]}}</td>
                <td class="col-1">{{sacks.stats.TackleAst["#text"]}}</td>
                <td class="col-1">{{sacks.stats.Stuffs["#text"]}}</td>
                <td class="col-1">{{sacks.stats.FumForced["#text"]}}</td>
                <td class="col-2">{{sacks.stats.Interceptions["#text"]}}</td>
              </tr>
            </div>
          </tbody>
        </table>
      </div>

      <h4>Interceptions</h4>
      <div>
        <table class="table table-striped table-sm">
          <thead>
            <tr class="d-flex">
              <th scope="col" class="col-3">Player</th>
              <th scope="col" class="col-2">Interceptions</th>
              <th scope="col" class="col-1">Int Long</th>
              <th scope="col" class="col-2">Int TD's</th>
              <th scope="col" class="col-1">Tackles Solo</th>
              <th scope="col" class="col-1">Sacks</th>
              <th scope="col" class="col-1">Stuffs</th>
              <th scope="col" class="col-1">Forced Fumbles</th>
            </tr>
          </thead>

          <tbody>
            <div v-for="(interceptions, index) in interceptionsLeaders.cumulativeplayerstats.playerstatsentry">
              <tr class="d-flex justify-content-around">
                <td v-if="interceptions.team" class="col-3">
                  {{interceptions.player.FirstName + " " + interceptions.player.LastName + " (" + interceptions.team.Abbreviation + ")"}}
                </td>
                <td v-else class="col-3">
                  {{interceptions.player.FirstName + " " + interceptions.player.LastName}}
                </td>
                <td class="col-2">{{interceptions.stats.Interceptions["#text"]}}</td>
                <td class="col-1">{{interceptions.stats.IntLng["#text"]}}</td>
                <td class="col-2">{{interceptions.stats.IntTD["#text"]}}</td>
                <td class="col-1">{{interceptions.stats.TackleSolo["#text"]}}</td>
                <td class="col-1">{{interceptions.stats.Sacks["#text"]}}</td>
                <td class="col-1">{{interceptions.stats.Stuffs["#text"]}}</td>
                <td class="col-1">{{interceptions.stats.FumForced["#text"]}}</td>
              </tr>
            </div>
          </tbody>
        </table>
      </div>
      <!-- =========== End Defensive Markup =========================== -->
    </section>

    <div v-else>
      <!-- Error Handling Markup for API Calls -->
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
      <!-- End API Error Markup -->
    </div>

    <!-- ================= End Defensive Template ========================================== -------->
</div> <!-- ======= End .container ======= -->

`, // End of Template
  data: function () {
    return {
      tacklesLeaders: {},
      sacksLeaders: {},
      interceptionsLeaders: {},
      fetchBaseUrl:
        "https://api.mysportsfeeds.com/v1.2/pull/nfl/2020-2021-regular/cumulative_player_stats.json?",
      params: [
        {
          teamstats: "none",
          playerstats: "Total,Solo,Ast,Sacks,Stuffs,Forced,Int",
          position: "de,dt,lb",
          sort: "stats.Total.D",
          limit: 10,
          force: true,
        },
        {
          teamstats: "none",
          playerstats:
            "tackles.Sacks,tackles.Total,tackles.Solo,tackles.Ast,interceptions.Stuffs,fumbles.Forced,Int",
          position: "de,dt,lb",
          sort: "stats.Tackles-Sacks.D",
          limit: 10,
          force: true,
        },
        {
          teamstats: "none",
          playerstats:
            "Interceptions.Int,Interceptions.TD,Interceptions.Yds,Interceptions.Avg,Interceptions.Lng,tackles.Sacks,tackles.Total,tackles.Solo,tackles.Ast,interceptions.Stuffs,fumbles.Forced",
          position: "cb,db,fs,ss",
          sort: "stats.Interceptions-Int.D",
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
    if (date.today >= seasonDates.nfl.regularSeasonEndDate) {
      this.end_of_season = true;
    } else {
      const leagueLeadersResponseArray = await getLeagueLeaders(
        this.fetchBaseUrl,
        this.params
      );
      // Assign Vue data objects to returned responses
      this.tacklesLeaders = leagueLeadersResponseArray[0]; // fetch array request element zero was the tackle's leaders
      this.sacksLeaders = leagueLeadersResponseArray[1];
      this.interceptionsLeaders = leagueLeadersResponseArray[2];

      this.loading = false;
    }
  },
});

module.exports = nfldefensiveleagueleaders;
