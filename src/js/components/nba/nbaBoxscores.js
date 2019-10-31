// src/js/components/nbaBoxScores.js
const Vue = require("vue");
const cumulativeNBAPlayerSeasonStats = require("./cumulativeNBAPlayerSeasonStats");

const { EventBus } = require("../../modules/event-bus");

const nbaBoxScoresStats = {
  nbaStats: Vue.component("nba-box-scores", {
    props: ["props_nba_box_scores_single_game", "props_index"],
    components: {
      cumulativeNBAPlayerSeasonStats: cumulativeNBAPlayerSeasonStats
    },
    data: function() {
      return {
        playerCumulativeStatsAway: this.props_nba_box_scores_single_game.data
          .gameboxscore.awayTeam.awayPlayers.playerEntry,
        playerCumulativeStatsHome: this.props_nba_box_scores_single_game.data
          .gameboxscore.homeTeam.homePlayers.playerEntry
      };
    },
    methods: {
      emitNBAPlayerSeasonStatsClicked: function($event) {
        let playerId = $event.target.dataset.playerId;
        EventBus.$emit("showNBAPlayerclicked", playerId);
      }
    },
    template: `
    <div class="vue-root-element">
        <p>
            <button class="btn-sm btn-outline-dark" type="button" data-toggle="collapse"
                v-bind:data-target="'.multi-collapse-' + props_index" aria-expanded="false"
                aria-controls="collapseExample">
                Game Stats
            </button>
        </p>

        <table class="table table-striped table-sm collapse" v-bind:class="'multi-collapse-' + props_index">
            <tbody>
            <!-- ---------- Away Team Boxscore ------------------------- -->
              <thead class="d-flex flex-wrap">
                  <th class="col-12 team">
                    {{ props_nba_box_scores_single_game.data.gameboxscore.game.awayTeam.Abbreviation }}:
                  </th>
                  <th class="col-4 justify-content-center" scope="col">Player</th>
                  <th class="col-2 justify-content-center" scope="col">Pts</th>
                  <th class="col-2 justify-content-center" scope="col">Rebs</th>
                  <th class="col-2 justify-content-center" scope="col">Assts</th>
                  <th class="col-2 justify-content-center" scope="col">3-pts</th>
              </thead>
            <template
                v-for="playerStats in playerCumulativeStatsAway">
                  <tr @click="emitNBAPlayerSeasonStatsClicked($event)" class="d-flex">
                      <td class="col-4 justify-content-center" :data-player-id="playerStats.player.ID" scope="row">
                          {{playerStats.player.FirstName}} {{playerStats.player.LastName}}</td>
                      <td class="col-2 justify-content-center" justify-content="center">
                          {{playerStats.stats.Pts['#text']}}</td>
                      <td class="col-2 justify-content-center">{{playerStats.stats.Reb['#text']}}</td>
                      <td class="col-2 justify-content-center">{{playerStats.stats.Ast['#text']}}</td>
                      <td class="col-2 justify-content-center">{{playerStats.stats.Fg3PtMade['#text']}}
                      </td>
                  </tr>

                  <nba-player-season-stats v-bind:props_player_id="playerStats.player.ID"></nba-player-season-stats>

            </template>
          </tbody>
      </table>                                    
                         <!-- ---------- End Away Team Boxscore ------------------------- -->

                     <!-- ---------- Begin Home Team Boxscore ------------------------- -->
                                    
      <table class="table table-striped table-sm collapse" v-bind:class="'multi-collapse-' + props_index">
          <tbody>
            <thead class="d-flex flex-wrap">
              <th class="col-12 team">
                    {{ props_nba_box_scores_single_game.data.gameboxscore.game.homeTeam.Abbreviation }}:
                  
                    </th>
                    <th class="col-4 justify-content-center" scope="col">Player</th>
                    <th class="col-2 justify-content-center" scope="col">Pts</th>
                    <th class="col-2 justify-content-center" scope="col">Rebs</th>
                    <th class="col-2 justify-content-center" scope="col">Assts</th>
                    <th class="col-2 justify-content-center" scope="col">3-pts</th>
            </thead>                                
            <template
                    v-for="playerStats in playerCumulativeStatsHome">
                      <tr class="d-flex">
                          <td class="col-4 justify-content-center" scope="row">
                              {{playerStats.player.FirstName}} {{playerStats.player.LastName}}</td>
                          <td class="col-2 justify-content-center" justify-content="center">
                              {{playerStats.stats.Pts['#text']}}</td>
                          <td class="col-2 justify-content-center">{{playerStats.stats.Reb['#text']}}</td>
                          <td class="col-2 justify-content-center">{{playerStats.stats.Ast['#text']}}</td>
                          <td class="col-2 justify-content-center">{{playerStats.stats.Fg3PtMade['#text']}}</td>
                      </tr>
            </template>
          </tbody>
      </table>
                      <!-- ---------- End Home Team Boxscore ------------------ -->

</div> <!-- ========= End Vue Root element ================= -->
    
 ` // end template
  })
};

module.export = { nbaBoxScoresStats };
