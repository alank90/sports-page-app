// src/js/components/mlbComponent.js

const Vue = require("vue");

const mlb = {
  mlbComponent: Vue.component("tab-mlb", {
    props: [
      "props_league_data",
      "props_league_standings",
      "props_baseball_playoffs",
      "props_end_of_season"
    ],
    template: `
                <div class="vue-root-element">
                <!-- ============== Markup for Divional Regular/Playoff Season Scores =============== -->
                    <div class="container mlb-scores">
                        <div class="row">
                            <div class="col-xs-12 col-md-4 col-lg-3" v-for="value in props_league_data">
                                <table class="table table-striped table-sm">
                                        <thead>
                                            <th scope="col" class="box-score-status is-completed" v-if="value.isCompleted">Final</th>
                                        </thead>
                    
                                        <tbody>
                                            <tr>
                                                <td class="team"> {{ value.game.awayTeam.Abbreviation }} </td>
                                                
                                                <td v-if="value.isCompleted === 'false'">Not Completed/Postponed: {{value.game.delayedOrPostponedReason}}</td>
                                                <template v-else>
                                                    <td class="inning-or-quarter-score" v-for="inning_score in value.inningSummary.inning">
                                                    {{inning_score.awayScore }}</td>
                                                    <td class="box-score-final" v-bind:class="{ won: Number(value.awayScore) > Number(value.homeScore) }">{{
                                                        value.awayScore
                                                        }}
                                                    </td>
                                                </template>

                                                <td v-if="value.game.awayTeam.Abbreviation === 'NYM'"><img scope="row" src="./src/img/nym.png"></td>
                                                <td v-if="value.game.awayTeam.Abbreviation === 'NYY'"><img scope="row" src="./src/img/nyy.png"></td>
                                            </tr>
                                            <tr>
                                                <td class="team"> {{ value.game.homeTeam.Abbreviation }} </td>
                                                
                                                <td v-if="value.isCompleted === 'false'"></td>
                                                <template v-else>
                                                    <td class="inning-or-quarter-score" v-for="inning_score in value.inningSummary.inning">
                                                    {{inning_score.homeScore }}</td>
                                                    
                                                    <td class="box-score-final" v-bind:class="{ won: Number(value.homeScore) > Number(value.awayScore) }">{{
                                                        value.homeScore }}
                                                    </td>
                                                </template>

                                                <td v-if="value.game.awayTeam.Abbreviation === 'NYM'"><img scope="row" src="./src/img/nym.png"></td>
                                                <td v-if="value.game.homeTeam.Abbreviation === 'NYY'"><img scope="row" src="./src/img/nyy.png"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                            </div> <!-- End v-for -->
                            
                        </div> <!-- End of row -->
                    </div> <!-- End container -->
                    <!-- ============== End of Markup for Divional Regular Season Standings =============== -->
                
                    <hr>
                    <!-- ============== Markup for Divional Regular Season Standings =============== -->
                    <div v-if="props_baseball_playoffs === false" class="container mlb-standings">
                        <div class="row">
                            <div class="col-12 col-md-4 division-name" v-for="value in props_league_standings">
                                {{ value['@name'] }}
                                <div class="team" v-for="item in value.teamentry">
                                    <table class="table table-striped table-sm">
                                        <thead>
                                            <th scope="col"></th>
                                            <th scope="col">{{ item.stats.Wins['@abbreviation'] }}</th>
                                            <th scope="col">{{ item.stats.Losses['@abbreviation'] }}</th>
                                            <th scope="col">{{ item.stats.GamesBack['@abbreviation'] }}</th>
                                            <th scope="col">{{ item.stats.WinPct['@abbreviation'] }}</th>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="team">{{ item.team.Abbreviation }}</td>
                                                <td class="team">{{ item.stats.Wins['#text'] }}</td>
                                                <td class="team">{{ item.stats.Losses['#text'] }}</td>
                                                <td class="team" v-if="item.stats.GamesBack['#text'] === '0.0'"> -- </td>
                                                <td class="team" v-else>{{ item.stats.GamesBack['#text'] }}</td>
                                                <td class="team" v-if="item.stats.WinPct['#text']">{{ item.stats.WinPct['#text'].slice(1) }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div> <!-- End item in value.teamentry -->
                            </div> <!-- End v-for props_league_standings -->
                        </div> <!-- End of row -->
                    </div> <!-- End container -->
                    <!-- ============== End of Markup for Divional Regular Season Standings =============== -->

                    <!-- ============== Markup for End of Season =============== -->
                    <div v-if="props_end_of_season === true">
                        <h2> End of Baseball Season. See Ya in April!!!</h2>
                    </div>
                    <!-- ============== End Markup for End of Season =============== -->


                     
                </div> <!-- End Vue root -->
            ` // End Template Literal
  })
};

module.exports = {
  mlb
};
