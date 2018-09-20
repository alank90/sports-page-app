// src/js/components/nflComponent.js

const Vue = require("vue");

const nfl = {
  nflComponent: Vue.component("tab-nfl", {
    data: function() {
      return {
        index: 0
      };
    },
    props: [
      "props_league_data_nfl",
      "props_nfl_days",
      "props_league_standings"
    ],
    template: `
            <div class="vue-root-element">
                <div class="container nfl-scores">
                    <div v-for="dayDataArray in props_league_data_nfl">
                            <div class="row">
                            <h2 class="w-100"> {{ props_nfl_days[index] }} </h2>
                                <div class="col-xs-12 col-md-4 col-lg-3" v-for="arrayItem in dayDataArray"> 
                                    <table class="table table-striped table-sm">   
                                    <thead>
                                        <th scope="col" class="box-score-status is-completed" v-if="arrayItem.isCompleted">Final</th>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td class="box-score-team"> {{ arrayItem.game.awayTeam.Abbreviation }} </td>
                                            <td class="box-score-inning" v-for="quarter_score in arrayItem.quarterSummary.quarter">
                                                {{quarter_score.awayScore }}</span>
                                            <td class="box-score-final" v-bind:class="{ won: arrayItem.awayScore > arrayItem.homeScore }">{{ arrayItem.awayScore }}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="box-score-team"> {{ arrayItem.game.homeTeam.Abbreviation }} </td>
                                            <td class="box-score-inning" v-for="quarter_score in arrayItem.quarterSummary.quarter">
                                                {{quarter_score.homeScore }}
                                            </td>
                                            <td class="box-score-final" v-bind:class="{ won: arrayItem.homeScore > arrayItem.awayScore }">{{ arrayItem.homeScore
                                                }}
                                            </td>
                                        </tr>
                                        <tr><td class="box-score-team w-150">Location:  {{ arrayItem.game.location }} </td></tr>
                                    </tbody>
                                    </table>     
                                </div> <!-- End v-for dayDataArray -->
                            </div>  <!-- End row -->
                    </div> <!-- End v-for props_league_data_nfl -->
                </div> <!-- End container -->

                        
        <!-- ==================================================================================================== -->

                    <hr>
                    <div class="container nfl-standings">
                        <div class="row">
                            <div class="col-12 col-md-4 division-name text-center" v-for="value in props_league_standings">
                                {{ value['@name'].slice(4) }} 
                                <div class="box-score-team" v-for="item in value.teamentry">
                                    <!-- <p> {{ item }} </p> -->
                                    <table class="table table-striped table-sm">
                                        <thead>
                                            <th scope="col"></th>
                                            <th scope="col">{{ item.stats.Wins['@abbreviation'] }}</th>
                                            <th scope="col">{{ item.stats.Losses['@abbreviation'] }}</th>
                                            <th scope="col">{{ item.stats.WinPct['@abbreviation'] }} </th>
                                        </thead> 
                                        <tbody>
                                        <tr>
                                            <td class="box-score-team">{{ item.team.Abbreviation }}</td>
                                            <td class="box-score-team">{{ item.stats.Wins['#text'] }}</td>
                                            <td class="box-score-team">{{ item.stats.Losses['#text'] }}</td>
                                            <td v-if="item.stats.Losses['#text'] != '0'" class="box-score-team">{{ item.stats.WinPct['#text'].slice(1) }}</td>
                                            <td v-else class="box-score-team">100%</td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </div> <!-- End item in value.teamentry -->
                            </div> <!-- end v-for in props_league_standings -->                   
                        </div>  <!-- End row -->
                </div> <!-- End container -->
            </div>  <!-- End Vue root element -->
            `
  })
};

module.exports = {
  nfl
};
