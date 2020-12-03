// src/js/components/nfloffensiveleagueleaders.js
const Vue = require("vue");
const getLeagueLeaders = require("../../modules/getLeagueLeaders");

const nfldefensiveleagueleaders = Vue.component("nfldefensiveleagueleaders", {
  template: `
    <div class="container">
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
    
    <section v-else>
    <h1>NFL League Leaders</h1>
    <hr>

    <!-- ================= Defensive Template ============================================== -------->
  <!-- =========== Defensive Markup =============================== -->
  
     <h3>Top Defensive Players by Tackles,Sack, and Interceptions</h3>
      <h4>Tackles</h4>
    <div>
      <table class="table table-striped table-sm">
        <thead>
          <tr class="d-flex">
            <th scope="col" class="col-3">Player</th>
            <th scope="col" class="col-2">Pass Catches</th>
            <th scope="col" class="col-1">Rec Yardage</th>
            <th scope="col" class="col-1">Rec Avg</th>
            <th scope="col" class="col-1">Rec TD's</th>
            <th scope="col" class="col-1">Rec Long</th>
            <th scope="col" class="col-1">Rec 20+</th>
            <th scope="col" class="col-1">Rec 40+</th>
            <th scope="col" class="col-1">Targets</th>
          </tr>
        </thead>

        <tbody>
          <div v-for="(tackles, index) tacklesLeaders.cumulativeplayerstats.playerstatsentry">
            <tr class="d-flex justify-content-around">
              <td class="col-3">
                {{tackles.player.FirstName + " " + tackles.player.LastName}}
              </td>
              <td class="col-2">{{tackles.stats.TackleTotal["#text"]}}</td>
              <td class="col-1">{{tackles.stats.TackleSolo["#text"]}}</td>
              <td class="col-1">{{tackles.stats.TackleAst["#text"]}}</td>
              <td class="col-1">{{tackles.stats.Sacks["#text"]}}</td>
              <td class="col-1">{{tackles.stats.Stuffs["#text"]}}</td>
              <td class="col-1">{{tackles.stats.Forced["#text"]}}</td>
              <td class="col-1">{{tackles.stats.Int["#text"]}}</td>
              <td class="col-1">{{tackles.stats.IntTD["#text"]}}</td>
            </tr>
          </div>
        </tbody>
      </table>
    </div> 
    <!-- =========== End Defensive Markup =========================== -->
  </section>
  
  <!-- ================= End Defensive Template ========================================== -------->

    </div> <!-- ======= End .container ======= -->
    `, // End of Template
  data: function () {
    return {
      tacklesLeaders: {},
      fetchBaseUrl:
        "https://api.mysportsfeeds.com/v1.2/pull/nfl/2020-2021-regular/cumulative_player_stats.json?",
      params: [
        {
          teamstats: "none",
          playerstats: "Att,Comp,Yds,Rec,TD",
          position: "qb",
          sort: "stats.Yds.D",
          limit: 10,
          force: true,
        },
        ,
        {
          teamstats: "none",
          playerstats: "Total,Solo,Ast,Sacks,Stuffs,Forced,Int,IntTD,",
          position: "de,dt,lb",
          sort: "stats.Total.D",
          limit: 10,
          force: true,
        },
      ],
      errored: false,
      loading: true,
    };
  },
});

module.exports = nfldefensiveleagueleaders;
