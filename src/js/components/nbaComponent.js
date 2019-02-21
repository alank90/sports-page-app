// src/js/components/nbaComponent.js

const Vue = require("vue");

const nba = {
  nbaComponent: Vue.component("tab-nba", {
    props: [
      "props_league_data",
      "props_league_standings",
      "props_basketball_playoffs",
      "props_end_of_season",
      "props_box_game_scores"
    ],
    template: `
            <div class="vue-root-element">
                <!-- Check if data was returned from get request to mysportsfeeds API -->
                <div v-if="props_league_data === undefined">
                    <p> No Games Yesterday</p>
                </div>
                <!-- ============== Markup for End of Season =============== -->
                <div v-else-if="props_end_of_season === true">
                    <h3> End of Basketball Season. See Ya in October!!!</h3>
                </div>
                <div v-else>
                     <!-- ============== Markup for Divional Regular/Playoff Season Scores =============== -->
                    <div class="container" v-if="props_box_game_scores">
                        <div class="row">
                            <div class="col-xs-12 col-md-4 col-lg-3" v-for="(arrayItem, index) in props_league_data">
                                    <table class="table table-striped table-sm">
                                        <thead>
                                            <th class="box-score-status is-completed" v-if="arrayItem.isCompleted">Final</th>
                                        </thead>
                    
                                        <tbody>

                                            <tr class="d-flex justify-content-around">
                                              <td class="team"> {{ arrayItem.game.awayTeam.Abbreviation }} </td>
                                              
                                              <td v-if="arrayItem.isCompleted === 'false'">Not Completed/Postponed: {{arrayItem.game.delayedOrPostponedReason}}</td>
                                              <template v-else>
                                                  <td class="inning-or-quarter-score" v-for="quarter_score in arrayItem.quarterSummary.quarter">
                                                      {{quarter_score.awayScore }}
                                                  </td>
                                                  <td class="box-score-final" v-bind:class="{ won: Number(arrayItem.awayScore) > Number(arrayItem.homeScore)}">{{ arrayItem.awayScore }}
                                                  </td>
                                              </template>
                                            </tr>

                                            <tr class="team-logo"> 
                                                <img v-if="arrayItem.game.awayTeam.Abbreviation === 'NYK'" class="team-logo" scope="row" src="./src/img/nyk.png">
                                                <img v-if="arrayItem.game.awayTeam.Abbreviation === 'BRO'" class="team-logo" scope="row" src="./src/img/bro.png">
                                            </tr>

                                            <tr class="d-flex justify-content-around">
                                                <td class="team"> {{ arrayItem.game.homeTeam.Abbreviation }} </td>

                                                <td v-if="arrayItem.isCompleted === 'false'"></td>
                                                <template v-else>
                                                    <td class="inning-or-quarter-score" v-for="quarter_score in arrayItem.quarterSummary.quarter">
                                                        {{quarter_score.homeScore }}</td>
                                                    <td class="box-score-final" v-bind:class="{ won: Number(arrayItem.homeScore) > Number(arrayItem.awayScore)}">{{ arrayItem.homeScore }}
                                                    </td>
                                                </template>
                                            </tr>

                                            <tr class="team-logo"> 
                                                    <img v-if="arrayItem.game.homeTeam.Abbreviation === 'NYK'" class="team-logo" scope="row" src="./src/img/nyk.png">
                                                    <img v-if="arrayItem.game.homeTeam.Abbreviation === 'BRO'" class="team-logo" scope="row" src="./src/img/bro.png">
                                            </tr>
                                            <tr class="shadow p-3 mb-5  rounded"><td class="team location">Location:  {{ arrayItem.game.location }} </td></tr>
                                            
                                        </tbody>
                                    </table>

                                    <!-- ==================== Begin Markup for Game Boxscores ============================ -->
                                    <p>
                                    <button class="btn-sm btn-outline-dark" type="button" data-toggle="collapse" v-bind:data-target="'.multi-collapse-' + index" aria-expanded="false" aria-controls="collapseExample">
                                     Game Stats
                                    </button>
                                    </p>
                                    
                                    <table class="table table-striped table-sm collapse" v-bind:class="'multi-collapse-' + index">
                                        <tbody>
                                            <!-- ---------- Away Team Boxscore ------------------------- -->
                                            <thead class="d-flex flex-wrap">
                                                <th class="col-12">
                                                    <td class="team" > {{ props_box_game_scores[index].data.gameboxscore.game.awayTeam.Abbreviation }}:</td>
                                                </th> 
                                                <th class="col-4 justify-content-center" scope="col">Player</th>
                                                <th class="col-2 justify-content-center" scope="col">Pts</th>
                                                <th class="col-2 justify-content-center" scope="col">Rebs</th>
                                                <th class="col-2 justify-content-center" scope="col">Assts</th>
                                                <th class="col-2 justify-content-center" scope="col">3-pts</th>
                                            </thead>
                                            <template v-for="playerStats in props_box_game_scores[index].data.gameboxscore.awayTeam.awayPlayers.playerEntry">
                                                <tr class="d-flex">
                                                    <td class="col-4 justify-content-center" scope="row">{{playerStats.player.FirstName}} {{playerStats.player.LastName}}</td>
                                                    <td class="col-2 justify-content-center" justify-content="center">{{playerStats.stats.Pts['#text']}}</td>
                                                    <td class="col-2 justify-content-center">{{playerStats.stats.Reb['#text']}}</td>
                                                    <td class="col-2 justify-content-center">{{playerStats.stats.Ast['#text']}}</td>
                                                    <td class="col-2 justify-content-center">{{playerStats.stats.Fg3PtMade['#text']}}</td>
                                                </tr>
                                            </template>
                                         </tbody>
                                    </table>
                                    <!-- ---------- End Away Team Boxscore ------------------------- -->

                                    <!-- ---------- Home Team Boxscore ------------------------- -->
                                    <table class="table table-striped table-sm collapse" v-bind:class="'multi-collapse-' + index">
                                        <tbody>
                                            <thead class="d-flex flex-wrap">
                                                <th class="col-12">
                                                    <td class="team" > {{ props_box_game_scores[index].data.gameboxscore.game.homeTeam.Abbreviation }}:</td>
                                                </th> 
                                                <th class="col-4 justify-content-center" scope="col">Player</th>
                                                <th class="col-2 justify-content-center" scope="col">Pts</th>
                                                <th class="col-2 justify-content-center" scope="col">Rebs</th>
                                                <th class="col-2 justify-content-center" scope="col">Assts</th>
                                                <th class="col-2 justify-content-center" scope="col">3-pts</th>
                                            </thead>
                                            <template v-for="playerStats in props_box_game_scores[index].data.gameboxscore.homeTeam.homePlayers.playerEntry">
                                                <tr class="d-flex">
                                                    <td class="col-4 justify-content-center" scope="row">{{playerStats.player.FirstName}} {{playerStats.player.LastName}}</td>
                                                    <td class="col-2 justify-content-center" justify-content="center">{{playerStats.stats.Pts['#text']}}</td>
                                                    <td class="col-2 justify-content-center">{{playerStats.stats.Reb['#text']}}</td>
                                                    <td class="col-2 justify-content-center">{{playerStats.stats.Ast['#text']}}</td>
                                                    <td class="col-2 justify-content-center">{{playerStats.stats.Fg3PtMade['#text']}}</td>
                                                </tr>
                                            </template>
                                         </tbody>
                                    </table>
                                    
                                    
                                    <!-- ---------- End Home Team Boxscore ------------------------- -->

                                    <!-- ==================== End Markup for Game Boxscores ============================ -->
                            
                            </div> <!-- End v-for -->
                            
                        </div> <!-- End of row -->
                    </div> <!-- End container -->


                    
                    <!-- ============== End of Markup for Divional Regular Season Standings =============== -->


                    <hr>
                    <!-- ============== Markup for Regular/Divisional Season Standings =============== -->
                    <div class="container">
                        <div v-if="props_basketball_playoffs === false">
                            <div class="row">
                                <div class="col-12 col-md-4 division-name text-center" v-for="value in props_league_standings">
                                    {{ value['@name'] }} 
                                    <div class="team" v-for="item in value.teamentry">
                                        <!-- <p> {{ item }} </p> -->
                                        <table class="table table-striped table-sm">
                                            <thead>
                                                <th></th>
                                                <th>{{ item.stats.Wins['@abbreviation'] }}</th>
                                                <th>{{ item.stats.Losses['@abbreviation'] }}</th>
                                                <th>{{ item.stats.GamesBack['@abbreviation'] }}</th>
                                                <th>{{ item.stats.WinPct['@abbreviation'] }} </th>
                                            </thead> 
                                            <tbody>
                                            <tr>
                                                <td class="team">{{ item.team.Abbreviation }}</td>
                                                <td class="team">{{ item.stats.Wins['#text'] }}</td>
                                                <td class="team">{{ item.stats.Losses['#text'] }}</td>
                                                <td class="team" v-if="item.stats.GamesBack['#text'] === '0.0'"> -- </td>
                                                <td class="team" v-else>{{ item.stats.GamesBack['#text'] }}</td>
                                                <td v-if="item.stats.Losses['#text'] != '0'" class="team">{{ item.stats.WinPct['#text'].slice(1) }}</td>
                                                <td v-else class="team">100%</td>
                                            </tr>
                                        </tbody>
                                        </table>
                                    </div> <!-- End item in value.teamentry -->
                                </div> <!-- end v-for in props_league_standings -->                   
                            </div>  <!-- End row -->
                        </div> <!-- End v-if -->
                    </div> <!-- ===== End container ======== -->
                    <!-- ============== End of Markup for Divional/Regular Season Standings =============== -->

                </div <!-- End else -->

            </div> <!-- ================= End Vue root  ======================================== -->
    ` // End Template Literal
  })
};

module.exports = nba;
