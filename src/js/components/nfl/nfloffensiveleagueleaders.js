// src/js/components/nfloffensiveleagueleaders.js
const Vue = require("vue");
const getLeagueLeaders = require("../../modules/getLeagueLeaders");
const seasonDates = require("../../modules/seasonDates");
const date = require("../../modules/todayDate");

const nfloffensiveleagueleaders = Vue.component("nfloffensiveleagueleaders", {
  template: `
  <div class="container" id="leagueleaders">
  
    <!-- ============== Markup for End of Season =============== -->
    <div v-if="end_of_season === true" class="container">
      <h3>End of Football Season. See you in the Fall</h3>
    </div>
    
    <!-- ============ Begin Markup for Stats Leaders ========== -->  
    <section id="bootstrap-overrides" v-else-if="qbLeaders.cumulativeplayerstats">
      <h1>NFL League Leaders</h1>
      <hr>

      <!-- ================= Offensive Template ============================================== -------->
      <!-- =========== Quarterbacks Markup ======================== -->
      <h2> Offensive </h2>
      <h3> Top Quarterback's by Pass Rating </h3>
      <table class="table table-striped table-sm">
          <thead class="thead-dark">
            <tr class="d-flex">
              <th scope="col" class="col-2">Player</th>
              <th scope="col" class="col-1">Pass Yds</th>
              <th scope="col" class="col-1">Td's</th>
              <th scope="col" class="col-1">Pass Atts</th>
              <th scope="col" class="col-1">Pass Comp</th>
              <th scope="col" class="col-1">Int</th>
              <th scope="col" class="col-1">Rush Yds</th>
              <th scope="col" class="col-1">Rush TD's</th>
              <th scope="col" class="col-3">QB Rating</th>
            </tr>
          </thead>

          <tbody>
            <div v-for="(qb, index) in qbLeaders.cumulativeplayerstats.playerstatsentry">
              <tr class="d-flex justify-content-around">
                <td class="col-2">
                  {{qb.player.FirstName + " " + qb.player.LastName + " (" + qb.team.Abbreviation + ")"}}
                </td>
                <td class="col-1">{{qb.stats.PassYards["#text"]}}</td>
                <td class="col-1">{{qb.stats.PassTD["#text"]}}</td>
                <td class="col-1">{{qb.stats.PassAttempts["#text"]}}</td>
                <td class="col-1">{{qb.stats.PassCompletions["#text"]}}</td>
                <td class="col-1">{{qb.stats.PassInt["#text"]}}</td>
                <td class="col-1">{{qb.stats.RushYards["#text"]}}</td>
                <td class="col-1">{{qb.stats.RushTD["#text"]}}</td>
                <td class="col-3">{{qbsSortedByRating[index].stats.PassRating}}</td>
              </tr>
            </div>
          </tbody>
      </table>
      
      <!-- =========== End Quarterbackup Markup======================== -->

      <!-- =========== Running Backs Markup =========================== -->
      <h3> Top Runningback's by Yardage </h3>
      <table class="table table-striped table-sm">
          <thead class="thead-dark">
            <tr class="d-flex">
              <th scope="col" class="col-2">Player</th>
              <th scope="col" class="col-2">Rushing Yds</th>
              <th scope="col" class="col-1">Rush Td's</th>
              <th scope="col" class="col-1">Rush Avg</th>
              <th scope="col" class="col-1">Rush Atts</th>
              <th scope="col" class="col-1">Recptns</th>
              <th scope="col" class="col-1">Rec Yds</th>
              <th scope="col" class="col-1">Rush 20+</th>
              <th scope="col" class="col-2">Rushing Yds Long</th>
            </tr>
          </thead>

          <tbody>
            <div v-for="(rb, index) in rbLeaders.cumulativeplayerstats.playerstatsentry">
              <tr class="d-flex justify-content-around">
                <td v-if="rb.team" class="col-2">
                  {{rb.player.FirstName + " " + rb.player.LastName + " (" + rb.team.Abbreviation + ")"}}
                </td>
                <td v-else class="col-3">
                  {{rb.player.FirstName + " " + rb.player.LastName}}
                </td>
                <td class="col-2">{{rb.stats.RushYards["#text"]}}</td>
                <td class="col-1">{{rb.stats.RushTD["#text"]}}</td>
                <td class="col-1">{{rb.stats.RushAverage["#text"]}}</td>
                <td class="col-1">{{rb.stats.RushAttempts["#text"]}}</td>
                <td class="col-1">{{rb.stats.Receptions["#text"]}}</td>
                <td class="col-1">{{rb.stats.RecYards["#text"]}}</td>
                <td class="col-1">{{rb.stats.Rush20Plus["#text"]}}</td>
                <td class="col-2">{{rb.stats.RushLng["#text"]}}</td>
              </tr>
            </div>
          </tbody>
      </table>
     

      <!-- =========== End Running Backs Markup ======================= -->

      <!-- =========== Receivers Markup =============================== -->
      <h3>Top Wide Receivers by Receptions</h3>
        <table class="table table-striped table-sm">
          <thead class="thead-dark">
            <tr class="d-flex">
              <th scope="col" class="col-2">Player</th>
              <th scope="col" class="col-2">Pass Catches</th>
              <th scope="col" class="col-2">Rec Yardage</th>
              <th scope="col" class="col-1">Rec Avg</th>
              <th scope="col" class="col-1">Rec TD's</th>
              <th scope="col" class="col-1">Rec Long</th>
              <th scope="col" class="col-1">Rec 20+</th>
              <th scope="col" class="col-1">Rec 40+</th>
              <th scope="col" class="col-1">Targets</th>
            </tr>
          </thead>

          <tbody>
            <div v-for="(wr, index) in wrLeaders.cumulativeplayerstats.playerstatsentry">
              <tr class="d-flex justify-content-around">
                <td class="col-2">
                  {{wr.player.FirstName + " " + wr.player.LastName + " (" + wr.team.Abbreviation + ")"}}
                </td>
                <td class="col-2">{{wr.stats.Receptions["#text"]}}</td>
                <td class="col-2">{{wr.stats.RecYards["#text"]}}</td>
                <td class="col-1">{{wr.stats.RecAverage["#text"]}}</td>
                <td class="col-1">{{wr.stats.RecTD["#text"]}}</td>
                <td class="col-1">{{wr.stats.RecLng["#text"]}}</td>
                <td class="col-1">{{wr.stats.Rec20Plus["#text"]}}</td>
                <td class="col-1">{{wr.stats.Rec40Plus["#text"]}}</td>
                <td class="col-1">{{wr.stats.Targets["#text"]}}</td>
              </tr>
            </div>
          </tbody>
        </table>
      <!-- =========== End Receivers Markup =========================== -->

      <!-- ============ End Offensive Template ========================================== -------->

    </section>

    <!-- Error Handling Markup for API Calls -->
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
  <!-- ================= End Offensive Template ========================================== -------->
 
</div> <!-- ======= End .container ======= -->

`, // End of Template
  data: function () {
    return {
      qbLeaders: {},
      rbLeaders: {},
      wrLeaders: {},
      fetchBaseUrl:
        "https://api.mysportsfeeds.com/v1.2/pull/nfl/2020-2021-regular/cumulative_player_stats.json?",
      params: [
        {
          teamstats: "none",
          playerstats: "Att,Comp,Yds,Rec,TD,Passing.Int",
          position: "qb",
          sort: "stats.Passing-Yds.D",
          limit: 10,
          force: true,
        },
        {
          teamstats: "none",
          playerstats:
            "rushing.Yds,rushing.Att,rushing.Avg,rushing.20+,rushing.Lng,rushing.TD,Receiving.Rec,Receiving.Yds",
          position: "rb",
          sort: "stats.Rushing-Yds.D",
          limit: 10,
          force: true,
        },
        {
          teamstats: "none",
          playerstats: "Rec,Yds,Avg,TD,Tgt,40+,20+,Lng",
          position: "wr",
          sort: "stats.Rec.D",
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
      this.qbLeaders = leagueLeadersResponseArray[0]; // fetch array request element zero was the qb's
      this.rbLeaders = leagueLeadersResponseArray[1];
      this.wrLeaders = leagueLeadersResponseArray[2];

      this.loading = false;
    }
  },
  computed: {
    qbRating: function () {
      return this.qbLeaders.cumulativeplayerstats.playerstatsentry.map(
        function (qb) {
          const Att = qb.stats.PassAttempts["#text"];
          const Comp = qb.stats.PassCompletions["#text"];
          const Yds = qb.stats.PassYards["#text"];
          const TD = qb.stats.PassTD["#text"];
          const Int = qb.stats.PassInt["#text"];

          const a = (Comp / Att - 0.3) * 5;
          const b = (Yds / Att - 3) * 0.25;
          const c = (TD / Att) * 20;
          const d = 2.375 - (Int / Att) * 25;

          if (a > 2.375) a = 2.375;
          if (b > 2.375) b = 2.375;
          if (c > 2.375) c = 2.375;
          if (d > 2.375) d = 2.375;

          if (a < 0) a = 0;
          if (b < 0) b = 0;
          if (c < 0) c = 0;
          if (d < 0) d = 0;

          const qbRating = ((a + b + c + d) / 6) * 100;

          return parseFloat(qbRating.toFixed(1)); // parseFloat eliminates any trailing zero's
        }
      );
    },
    qbsSortedByRating: function () {
      // Note this.qbRating is not scoped in .forEach() loop.
      let temp = this.qbRating;

      // add qbRating computed property array element to each qbLeaders array element object.
      this.qbLeaders.cumulativeplayerstats.playerstatsentry.forEach(function (
        qb,
        index
      ) {
        qb.stats.PassRating = temp[index]; // Create new property Passrating on qbLeaders object
      });

      // Now Let's sort qbLeaders on the new PassRating property
      return this.qbLeaders.cumulativeplayerstats.playerstatsentry.sort(
        function (a, b) {
          return b.stats.PassRating - a.stats.PassRating;
        }
      );
    },
  },
});

module.exports = nfloffensiveleagueleaders;
