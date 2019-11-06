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
    computed: {
      teamColorAway: function() {
        return `${this.props_nba_box_scores_single_game.data.gameboxscore.game.awayTeam.Abbreviation.toLowerCase()}-nba`;
      },
      teamColorHome: function() {
        return `${this.props_nba_box_scores_single_game.data.gameboxscore.game.homeTeam.Abbreviation.toLowerCase()}-nba`;
      }
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
                  <th class="col-12 team" :class="teamColorAway">
                    {{ props_nba_box_scores_single_game.data.gameboxscore.game.awayTeam.City }} {{ props_nba_box_scores_single_game.data.gameboxscore.game.awayTeam.Name }}
                  </th>
                  <th class="col-4 justify-content-center" scope="col">Player</th>
                  <th class="col-2 justify-content-center" scope="col">Pts</th>
                  <th class="col-2 justify-content-center" scope="col">Rebs</th>
                  <th class="col-2 justify-content-center" scope="col">Asst</th>
                  <th class="col-2 justify-content-center" scope="col">3PT</th>
              </thead>
            <template
                v-for="playerStats in playerCumulativeStatsAway">
                  <tr @click="emitNBAPlayerSeasonStatsClicked($event)" class="d-flex">
                      <td class="col-4 justify-content-center" :data-player-id="playerStats.player.ID" scope="row" title="Click for Season Stats">
                          {{playerStats.player.FirstName}} {{playerStats.player.LastName}} ({{playerStats.player.Position}})
                          <i class="fa fa-chevron-down" ></i>
                      </td>
                      <td class="col-2 justify-content-center" justify-content="center">
                          {{playerStats.stats.Pts['#text']}}</td>
                      <td class="col-2 justify-content-center">{{playerStats.stats.Reb['#text']}}</td>
                      <td class="col-2 justify-content-center">{{playerStats.stats.Ast['#text']}}</td>
                      <td class="col-2 justify-content-center">{{playerStats.stats.Fg3PtMade['#text']}}
                      </td>
                  </tr>

                  <!-- === Season Stats Component ==== -->
                  <nba-player-season-stats v-bind:props_player_id="playerStats.player.ID"></nba-player-season-stats>

            </template>
          </tbody>
      </table>                                    
                         <!-- ---------- End Away Team Boxscore ------------------------- -->

                     <!-- ---------- Begin Home Team Boxscore ------------------------- -->
                                    
      <table class="table table-striped table-sm collapse" v-bind:class="'multi-collapse-' + props_index">
          <tbody>
            <thead class="d-flex flex-wrap">
              <th class="col-12 team" :class="teamColorHome">
                {{ props_nba_box_scores_single_game.data.gameboxscore.game.homeTeam.City }} {{ props_nba_box_scores_single_game.data.gameboxscore.game.homeTeam.Name }}
              </th>
                    <th class="col-4 justify-content-center" scope="col">Player</th>
                    <th class="col-2 justify-content-center" scope="col">Pts</th>
                    <th class="col-2 justify-content-center" scope="col">Rebs</th>
                    <th class="col-2 justify-content-center" scope="col">Asst</th>
                    <th class="col-2 justify-content-center" scope="col">3PT</th>
            </thead>                                
            <template
                    v-for="playerStats in playerCumulativeStatsHome">
                      <tr @click="emitNBAPlayerSeasonStatsClicked($event)" class="d-flex">
                          <td class="col-4 justify-content-center" :data-player-id="playerStats.player.ID" scope="row" title="Click for Season Stats">
                              {{playerStats.player.FirstName}} {{playerStats.player.LastName}} ({{playerStats.player.Position}})
                              <i class="fa fa-chevron-down" ></i>
                          </td>
                          <td class="col-2 justify-content-center" justify-content="center">
                              {{playerStats.stats.Pts['#text']}}
                              
                              </td>
                          <td class="col-2 justify-content-center">{{playerStats.stats.Reb['#text']}}</td>
                          <td class="col-2 justify-content-center">{{playerStats.stats.Ast['#text']}}</td>
                          <td class="col-2 justify-content-center">{{playerStats.stats.Fg3PtMade['#text']}}</td>
                      </tr>

                      <!-- === Season Stats Component ==== -->
                      <nba-player-season-stats v-bind:props_player_id="playerStats.player.ID"></nba-player-season-stats>

            </template>
          </tbody>
      </table>
                      <!-- ---------- End Home Team Boxscore ------------------ -->

</div> <!-- ========= End Vue Root element ================= -->
    
 ` // end template
  })
};

module.export = { nbaBoxScoresStats };
