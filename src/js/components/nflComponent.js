// src/js/components/nflComponent.js

const Vue = require("vue");

const nfl = {
  nflComponent: Vue.component("tab-nfl", {
    props: [
      "props_league_data_nfl",
      "props_league_standings",
      "props_nfl_playoffs",
      "props_end_of_season",
      "props_box_game_scores"
    ],
    data: function() {
      return {
        nfl_days: ["Sunday", "Thursday Night", "Monday Night"]
      };
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
                <!-- ========== Markup for Divional/Regular Season Dailey Scores ====== -->
                <div v-else>
                    <div class="container">
                        <div v-for="(dayDataArray, key, index) in props_league_data_nfl">
                            <!-- v-if prevents Vue from trying to access dayDataArray before it has become populated -->
                            <h2> {{ nfl_days[index] }} <span v-if="dayDataArray.length" class="week">(Week
                                    {{ dayDataArray[0].game.week }})</span></h2>
            
                            <div class="row">
                                <div class="col-xs-12 col-sm-4 col-lg-3" v-for="arrayItem in dayDataArray">
            
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

                                    <!-- ===================================================================================== -->                                
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
