// src/js/components/nflComponent.js

const Vue = require("vue");

const nfl = {
  nflComponent: Vue.component("tab-nfl", {
    props: [
      "props_league_data_nfl",
      "props_league_standings"
    ],
    data: function()  {
        return {
           nfl_days: ["Sunday", "Thursday Night", "Monday Night"]
        };
    },
    template: `
            <div class="vue-root-element">
                <div class="container nfl-scores">
                    <div v-for="(dayDataArray, key, index) in props_league_data_nfl">
                    <!-- v-if prevents Vue from trying to access daydataArray before it has become populated -->
                    <h2> {{ nfl_days[index] }} <span v-if="dayDataArray.length" class="week">(Week {{ dayDataArray[0].game.week }})</span></h2>
                        
                        <div class="row"> 
                            <div class="col-xs-12 col-md-4 col-lg-3" v-for="arrayItem in dayDataArray"> 
                            
                                <table class="table table-striped table-sm">   
                                <thead>
                                    <th scope="col" class="box-score-status is-completed" v-if="arrayItem.isCompleted">Final</th>
                                </thead>

                                    <tbody>
                                        <tr class="d-flex">
                                            <td class="team col-2"> {{ arrayItem.game.awayTeam.Abbreviation }} </td>
                                            
                                            <td v-if="arrayItem.isCompleted === 'false'">Not Completed/Postponed: {{arrayItem.game.delayedOrPostponedReason}}</td>
                                            <template v-else>
                                                <td class="inning-or-quarter-score col-1" v-for="quarter_score in arrayItem.quarterSummary.quarter">
                                                    {{quarter_score.awayScore }}
                                                </td>
                                                <td class="box-score-final col-1" v-bind:class="{ won: Number(arrayItem.awayScore) > Number(arrayItem.homeScore)}">{{ arrayItem.awayScore }}
                                                </td>
                                            </template>

                                            <td v-if="arrayItem.game.awayTeam.Abbreviation === 'NYJ'"><img class="team-logo" scope="row" src="./src/img/nyj.png"></td>
                                            <td v-if="arrayItem.game.awayTeam.Abbreviation === 'NYG'"><img class="team-logo" scope="row"  src="./src/img/nyg.png"></td>
                                        </tr>

                                        <tr class="d-flex">
                                            <td class="team col-2" > {{ arrayItem.game.homeTeam.Abbreviation }} </td>

                                            <td v-if="arrayItem.isCompleted === 'false'"></td>
                                            <template v-else>
                                                <td class="inning-or-quarter-score col-1" v-for="quarter_score in arrayItem.quarterSummary.quarter">
                                                    {{quarter_score.homeScore }}</td>
                                                <td class="box-score-final col-1" v-bind:class="{ won: Number(arrayItem.homeScore) > Number(arrayItem.awayScore)}">{{ arrayItem.homeScore }}
                                                </td>
                                            </template>

                                            <td v-if="arrayItem.game.homeTeam.Abbreviation === 'NYJ'"><img class="team-logo" scope="row" src="./src/img/nyj.png"></td>
                                            <td v-if="arrayItem.game.homeTeam.Abbreviation === 'NYG'"><img class="team-logo" scope="row" src="./src/img/nyg.png"></td>
                                        </tr>
                                        <tr class="shadow p-3 mb-5 bg-white rounded"><td class="team location">Location:  {{ arrayItem.game.location }} </td></tr>
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
                                <div v-for="item in value.teamentry">
                                    <table class="table table-striped table-sm">
                                        <thead>
                                            <th scope="col"></th>
                                            <th scope="col">{{ item.stats.Wins['@abbreviation'] }}</th>
                                            <th scope="col">{{ item.stats.Losses['@abbreviation'] }}</th>
                                            <th scope="col">{{ item.stats.Ties['@abbreviation'] }}</th>
                                            <th scope="col">{{ item.stats.WinPct['@abbreviation'] }} </th>
                                        </thead> 
                                        <tbody>
                                        <tr>
                                            <td class="team">{{ item.team.Abbreviation }}</td>
                                            <td class="team">{{ item.stats.Wins['#text'] }}</td>
                                            <td class="team">{{ item.stats.Losses['#text'] }}</td>
                                            <td class="team">{{ item.stats.Ties['#text'] }}</td>
                                            <td v-if="item.stats.Losses['#text'] != '0'" class="team">{{ item.stats.WinPct['#text'].slice(1) }}</td>
                                            <td v-else class="team">100%</td>
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
