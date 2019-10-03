// src/js/components/nflComponent.js

const Vue = require("vue");
const boxScores = require("./nflBoxScores");

const nfl = {
  nflComponent: Vue.component("tab-nfl", {
    props: [
      "props_league_data_nfl",
      "props_league_standings",
      "props_nfl_playoffs",
      "props_end_of_season",
      "props_box_game_scores_nfl"
    ],
    data: function() {
      return {
        nfl_days: ["Sunday", "Thursday Night", "Monday Night"]
      };
    },
    components: {
        boxScores: boxScores
    },
    template: `
            <div class="vue-root-element">
                <!-- Check if data was returned from Get request to mysportsfeeds API -->
                <div v-if="props_league_data_nfl === undefined">
                    <p> No Games Yesterday</p>
                </div>
                <!-- ============== Markup for End of Season =============== -->
                <div v-else-if="props_end_of_season === true" class="container">
                    <h3> End of Football Season. See you in the Fall </h3>
                </div>
                <!-- ========== Markup for Divional/Regular Season Daily Scores ====== -->
                <div v-else>
                    <div class="container">
                        <div v-for="(dayDataArray, key, index) in props_league_data_nfl">
                            <!-- v-if prevents Vue from trying to access dayDataArray before it has become populated -->
                            <h2> {{ nfl_days[index] }} <span v-if="dayDataArray.length" class="week">(Week
                                    {{ dayDataArray[0].game.week }})</span></h2>
            
                            <div class="row">
                                <div v-for="(arrayItem, arrayItemIndex) in dayDataArray" class="col-xs-12 col-sm-4 col-lg-3">
                                    <table class="table table-striped table-sm">
                                        <thead>
                                            <th scope="col" class="box-score-status is-completed" v-if="arrayItem.isCompleted">Final
                                            </th>
                                        </thead>
            
                                        <tbody>
                                            <tr class="d-flex justify-content-around">
                                                <td class="team"> {{ arrayItem.game.awayTeam.Abbreviation }} </td>
            
                                                <td v-if="arrayItem.isCompleted === 'false'">Not Completed/Postponed:
                                                    {{arrayItem.game.delayedOrPostponedReason}}</td>
                                                <template v-else>
                                                    <td class="inning-or-quarter-score"
                                                        v-for="quarter_score in arrayItem.quarterSummary.quarter">
                                                        {{quarter_score.awayScore }}
                                                    </td>
                                                    <td class="box-score-final"
                                                        v-bind:class="{ won: Number(arrayItem.awayScore) > Number(arrayItem.homeScore)}">
                                                        {{ arrayItem.awayScore }}
                                                    </td>
                                                </template>
                                            </tr>
                                            <tr class="team-logo">
                                                <img v-if="arrayItem.game.awayTeam.Abbreviation === 'NYJ'" class="team-logo"
                                                    scope="row" src="./src/img/nyj.png">
                                                <img v-if="arrayItem.game.awayTeam.Abbreviation === 'NYG'" class="team-logo"
                                                    scope="row" src="./src/img/nyg.png">
                                            </tr>
            
                                            <tr class="d-flex justify-content-around">
                                                <td class="team"> {{ arrayItem.game.homeTeam.Abbreviation }} </td>
            
                                                <td v-if="arrayItem.isCompleted === 'false'"></td>
                                                <template v-else>
                                                    <td class="inning-or-quarter-score"
                                                        v-for="quarter_score in arrayItem.quarterSummary.quarter">
                                                        {{quarter_score.homeScore }}</td>
                                                    <td class="box-score-final"
                                                        v-bind:class="{ won: Number(arrayItem.homeScore) > Number(arrayItem.awayScore)}">
                                                        {{ arrayItem.homeScore }}
                                                    </td>
                                                </template>
                                            </tr>
                                            <tr class="team-logo">
                                                <img v-if="arrayItem.game.homeTeam.Abbreviation === 'NYJ'" class="team-logo"
                                                    scope="row" src="./src/img/nyj.png">
                                                <img v-if="arrayItem.game.homeTeam.Abbreviation === 'NYG'" class="team-logo"
                                                    scope="row" src="./src/img/nyg.png">
                                            </tr>
            
                                            <tr class="shadow p-3 mb-5  rounded">
                                                <td class="team location">Location: {{ arrayItem.game.location }} </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    
                                    <!-- ======== Start BoxScores Template Markup ============== 
                                    <div v-if="props_box_game_scores_nfl[nfl_days[index].split(' ')[0].toLowerCase()] != null">  {{ props_box_game_scores_nfl[nfl_days[index].split(' ')[0].toLowerCase()][arrayItemIndex] }} </div>
                                    -->
                                    

                                    <!-- ======== End BoxScores Template markup =============== -->
                                </div> <!-- End v-for dayDataArray -->
                            </div> <!-- End row -->
                        </div> <!-- End v-for props_league_data_nfl -->
            
                    </div> <!-- End container -->
                    <!-- ============== End of Markup for Divional/Regular Season Scores =============== -->
            
                    <!-- ------------------------------------------------------------------------------------------------------ -->
            
                    <!-- ============== Markup for Regular/Divisional Season Standings =============== -->
            
                    <hr>
                    <div class="container">
                        <div class="row">
                            <div class="col-xs-12 col-sm-4 col-lg-3 division-name text-center"
                                v-for="value in props_league_standings">
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
                                                <td v-if="item.stats.Losses['#text'] != '0'" class="team">
                                                    {{ item.stats.WinPct['#text'].slice(1) }}</td>
                                                <td v-else class="team">100%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div> <!-- End item in value.teamentry -->
                            </div> <!-- end v-for in props_league_standings -->
                        </div> <!-- End row -->
                        <!-- ============== End of Markup for Regular/Divisional Season Standings =============== -->
                    </div> <!-- End container -->
            
                </div> <!-- end else -->
            </div> <!-- End Vue root element -->
            `
  })
};

module.exports = {
  nfl
};
