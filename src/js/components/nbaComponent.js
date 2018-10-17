// src/js/components/nbaComponent.js

const Vue = require("vue");

const nba = {
  nbaComponent: Vue.component("tab-nba", {
    props: [
      "props_league_data",
      "props_league_standings",
      "props_basketball_playoffs",
      "props_end_of_season"
    ],
    template: `
                <div class="vue-root-element">
                     <!-- ============== Markup for Divional Regular/Playoff Season Scores =============== -->
                    <div class="container">
                        <div class="row">
                            <div class="col-xs-12 col-md-4 col-lg-3" v-for="arrayItem in props_league_data">
                                    <table class="table table-striped table-sm">
                                        <thead>
                                            <th scope="col" class="box-score-status is-completed" v-if="arrayItem.isCompleted">Final</th>
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
                                                <th scope="col"></th>
                                                <th scope="col">{{ item.stats.Wins['@abbreviation'] }}</th>
                                                <th scope="col">{{ item.stats.Losses['@abbreviation'] }}</th>
                                                <th scope="col">{{ item.stats.GamesBack['@abbreviation'] }}</th>
                                                <th scope="col">{{ item.stats.WinPct['@abbreviation'] }} </th>
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

                    <!-- ============== Markup for End of Season =============== -->
                        <div v-if="props_end_of_season === true">
                            <h2> End of Basketball Season. See Ya in October!!!</h2>
                        </div>
                    <!-- ============== End Markup for End of Season =============== -->

                  </div> <!-- ================= End Vue root  ======================================== -->
                ` // End Template Literal
  })
};

module.exports = nba;
