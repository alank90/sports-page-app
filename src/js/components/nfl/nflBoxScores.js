const Vue = require("vue");
const axios = require("axios");

const boxScoresStats = {
  stats: Vue.component("box-scores", {
    data: function() {
      return {
        
      };
    },
    template: `
          <p> Test Paragraph. </p>
                          
        ` // End template
  })
};

module.export = { boxScoresStats };

/*
          <!-- ==================== Begin Markup for NFL Game Boxscores ============================ -->
          <!-- ===================================================================================== -->
          <!-- First see if any games were not completed. If not, the props_box_game_score.length
               will equal props_league_data.length -->
              <div v-for="(playerStats, index) in props_box_game_scores">                
                  <p> {{ index }}
                      <button class="btn-sm btn-outline-dark" type="button" data-toggle="collapse" 
                          v-bind:data-index="index" v-bind:data-target="'.multi-collapse-' + index" aria-expanded="false"
                          aria-controls="collapseExample">
                          Game Stats
                      </button> 
                      <!-- Use v-if to prevent Vue from throwing errors in console before async 
                           call for box scores complete -->
                      
                  </p>

                  <!-- ======== Away Team Offense Stats ============= -->
                      <div >
                          <table class="table table-striped table-bordered table-hover table-sm collapse" v-bind:class="'multi-collapse-' + index">
                              <tbody>
                                  <thead class="d-flex flex-wrap">
                                      <th class="col-4 justify-content-center" scope="col">Player</th>
                                      <th class="col-2 justify-content-center" scope="col">Comp/Att</th>
                                      <th class="col-2 justify-content-center" scope="col">Yds</th>
                                      <th class="col-2 justify-content-center" scope="col">TD</th>
                                      <th class="col-2 justify-content-center" scope="col">Int</th>
                                  </thead>

                                  <div v-if="props_box_game_scores">
                                          <p v-if="props_box_game_scores"> {{ index }} </p>  
                                          <tr v-if="playerStats.player.Position === 'QB'" class="d-flex">
                                              <td class="col-4 justify-content-center" :data-player-id='playerStats.player.ID' scope="row">
                                                  {{playerStats.player.FirstName}} {{playerStats.player.LastName}} ({{playerStats.player.Position}})
                                              </td>
                                              <td class="col-2 justify-content-center" justify-content="center">
                                                  {{playerStats.stats.PassCompletions['#text']}}/{{playerStats.stats.PassAttempts['#text']</td>
                                              <td class="col-2 justify-content-center">{{playerStats.stats.PassYards['#text']}}</td>
                                              <td class="col-2 justify-content-center">{{playerStats.stats.PassTD['#text']}}</td>
                                              <td class="col-2 justify-content-center">{{playerStats.stats.IntTD['#text']}}
                                              </td>
                                          </tr>

                                  </div>
                              </tbody>
                          </table>
                      </div>

                      <!-- ======== Away Team Offense Stats End ============= -->
        </div> <!-- ============ End Markup for NFL BoxScores ============ -->
*/
