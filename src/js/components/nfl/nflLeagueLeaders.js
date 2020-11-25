// src/js/components/nflLeagueLeaders.js
const Vue = require("vue");
const getLeagueLeaders = require("../../modules/getLeagueLeaders");

const nflLeagueLeaders = Vue.component("nflleagueleaders", {
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
    <h2>League Leaders Go Here</h2>
    <div>
      <table class="table table-striped table-sm">
        <thead>
          <tr class="d-flex">
            <th scope="col" class="col-3">Player</th>
            <th scope="col" class="col-2">Pass Yds</th>
            <th scope="col" class="col-1">Td's</th>
            <th scope="col" class="col-1">Pass Attempts</th>
            <th scope="col" class="col-1">Pass Comp</th>
            <th scope="col" class="col-1">Int</th>
            <th scope="col" class="col-1">Rush Yds</th>
            <th scope="col" class="col-1">Rush TD's</th>
            <th scope="col" class="col-1">Rating</th>
          </tr>
        </thead>

        <tbody>
          <div v-for="(qb, index) in qbLeaders">
            <tr class="d-flex justify-content-around">
              <td class="col-3">
                {{qb.player.FirstName + " " + qb.player.LastName}}
              </td>
              <td class="col-2">{{qb.stats.PassYards["#text"]}}</td>
              <td class="col-1">{{qb.stats.PassTD["#text"]}}</td>
              <td class="col-1">{{qb.stats.PassAttempts["#text"]}}</td>
              <td class="col-1">{{qb.stats.PassCompletions["#text"]}}</td>
              <td class="col-1">{{qb.stats.IntTD["#text"]}}</td>
              <td class="col-1">{{qb.stats.RushYards["#text"]}}</td>
              <td class="col-1">{{qb.stats.RushTD["#text"]}}</td>
              <td class="col-1">Rating here</td>
            </tr>
          </div>
        </tbody>
      </table>
    </div>
  </section>
</div>

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
      errored: false,
      loading: true,
    };
  },
  mounted: async function () {
    const qbResponse = await getLeagueLeaders(this.fetchQbUrl, this.params);
    this.qbLeaders = qbResponse.cumulativeplayerstats.playerstatsentry;

    this.loading = false;
    console.log(
      "qBLeaders is %s",
      qbResponse.cumulativeplayerstats.playerstatsentry[4].player.LastName
    );
  },
});

module.exports = nflLeagueLeaders;
