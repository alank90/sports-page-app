// src/js/components/mlbComponent.js

const Vue = require("vue");
const cumulativePlayerStats = require("./cumulativePlayerStatsComponent");
const cumulativePitcherStats = require("./cumulativePitcherStatsComponent");

const { EventBus } = require("../../modules/event-bus");

const mlb = {
  mlbComponent: Vue.component("tab-mlb", {
    props: [
      "props_league_data",
      "props_league_standings",
      "props_baseball_playoffs",
      "props_end_of_season",
      "props_box_game_scores_mlb"
    ],
    data: function() {
      return {
        showPlayerSeasonStats: false
      };
    },
    components: {
      cumulativePlayerStats: cumulativePlayerStats,
      cumulativePitcherStats: cumulativePitcherStats
    },
    methods: {
      emitPlayerSeasonStatsClicked: function($event) {
        let playerId = $event.target.dataset.playerId;
        EventBus.$emit("showPlayerTemplateClicked", playerId);
      },
      emitPitcherSeasonStatsClicked: function($event) {
        let playerId = $event.target.dataset.playerId;
        EventBus.$emit("showPitcherTemplateClicked", playerId);
      }
    },
    template: `
                <div class="vue-root-element">
                    <!-- Check if data was returned from get request to mysportsfeeds API -->
                    <div v-if="props_league_data === undefined">
                        <p> No Games Yesterday</p>
                    </div>
                    <!-- =========== Markup for End of Season ======= -->
                    <div v-else-if="props_end_of_season === true">
                        <h2> End of Baseball Season. See Ya in April!!!</h2>
                    </div>
                    <div v-else>
                        <!-- ============== Markup for Divisional Regular/Playoff Season Scores =============== -->
                        <div class="container" v-if="props_box_game_scores_mlb">
                            <div class="row">
                                <div class="col-xs-12 col-md-6 col-lg-4 display-boxscores" v-for="(value, index) in props_league_data" >
                                    <table class="table table-striped table-sm">
                                        <thead>
                                            <th scope="col" class="box-score-status is-completed" v-if="value.isCompleted">Final</th>
                                        </thead>
                
                                        <tbody>
                                            <tr>
                                                <td class="team"> {{ value.game.awayTeam.Abbreviation }} </td>
                
                                                <td v-if="value.isCompleted === 'false'">Not Completed/Postponed:
                                                    {{value.game.delayedOrPostponedReason}}</td>
                                                <template v-else>
                                                    <td class="inning-or-quarter-score"
                                                        v-for="inning_score in value.inningSummary.inning">
                                                        {{inning_score.awayScore }}</td>
                                                    <td class="box-score-final"
                                                        v-bind:class="{ won: Number(value.awayScore) > Number(value.homeScore) }">{{
                                                                            value.awayScore
                                                                            }}
                                                    </td>
                                                </template>
                
                                                <td v-if="value.game.awayTeam.Abbreviation === 'NYM'"><img scope="row"
                                                        src="./src/img/nym.png"></td>
                                                <td v-if="value.game.awayTeam.Abbreviation === 'NYY'"><img scope="row"
                                                        src="./src/img/nyy.png"></td>
                                            </tr>
                                            <tr>
                                                <td class="team"> {{ value.game.homeTeam.Abbreviation }} </td>
                
                                                <td v-if="value.isCompleted === 'false'"></td>
                                                <template v-else>
                                                    <td class="inning-or-quarter-score"
                                                        v-for="inning_score in value.inningSummary.inning">
                                                        {{inning_score.homeScore }}</td>
                
                                                    <td class="box-score-final"
                                                        v-bind:class="{ won: Number(value.homeScore) > Number(value.awayScore) }">{{
                                                                            value.homeScore }}
                                                    </td>
                                                </template>
                
                                                <td v-if="value.game.homeTeam.Abbreviation === 'NYM'"><img scope="row"
                                                        src="./src/img/nym.png"></td>
                                                <td v-if="value.game.homeTeam.Abbreviation === 'NYY'"><img scope="row"
                                                        src="./src/img/nyy.png"></td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <!-- ==================== Begin Markup for Game MLB Boxscores ============================ -->
                                      <!-- First see if any games were not completed. If not, the props_box_game_score.length
                                           will equal props_league_data.length -->
                                            <div v-if="props_box_game_scores_mlb.length === props_league_data.length">                
                                                <p> 
                                                    <button class="btn-sm btn-outline-dark" type="button" data-toggle="collapse" 
                                                        v-bind:data-index="index" v-bind:data-target="'.multi-collapse-' + index" aria-expanded="false"
                                                        aria-controls="collapseExample">
                                                        Game Stats
                                                    </button>
                                                </p>
<!-- =============================================== Begin v-if for MLB Boxscores ====================================================================== -->
                                                <!-- ======== Away Team Boxscore =================== -->
                                                <!-- ========= Player Stats ================ -->
                                                <table @click="emitPlayerSeasonStatsClicked($event)" class="table table-striped table-bordered table-hover table-sm collapse" v-bind:class="'multi-collapse-' + index">
                                                    <tbody class="table table-striped">
                                                        <thead class="d-flex flex-wrap">
                                                            <th class="col-12">
                                                                {{ props_box_game_scores_mlb[index].data.gameboxscore.game.awayTeam.City }} {{ props_box_game_scores_mlb[index].data.gameboxscore.game.awayTeam.Name }}:
                                                            </th>
                                                            <th class="col-4 justify-content-center" scope="col">Player</th>
                                                            <th class="col-2 justify-content-center" scope="col">Hits</th>
                                                            <th class="col-2 justify-content-center" scope="col">HR's</th>
                                                            <th class="col-2 justify-content-center" scope="col">R/Avg</th>
                                                            <th class="col-2 justify-content-center" scope="col">RBI's</th>
                                                        </thead>

                                                        <div
                                                            v-for="playerStats in props_box_game_scores_mlb[index].data.gameboxscore.awayTeam.awayPlayers.playerEntry">
                                                                <tr v-if="playerStats.stats.AtBats['#text'] > 0" class="d-flex">
                                                                    <td class="col-4 justify-content-center" :data-player-id='playerStats.player.ID' scope="row" title="Click for Season Stats">
                                                                        {{playerStats.player.FirstName}} {{playerStats.player.LastName}} ({{playerStats.player.Position}})</td>
                                                                    </td>
                                                                    <td class="col-2 justify-content-center" justify-content="center">
                                                                        {{playerStats.stats.Hits['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.Homeruns['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.Runs['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.RunsBattedIn['#text']}}
                                                                    </td>
                                                                </tr>

                                                                <player-season-stats v-bind:props_player_id="playerStats.player.ID"></player-season-stats>
                                                        </div>
                                                    </tbody>
                                                </table>
                                                                                                
                                                <!-- ========= Pitcher Stats ============== -->
                                                <table @click="emitPitcherSeasonStatsClicked($event)" class="table table-striped table-bordered table-hover table-sm collapse" v-bind:class="'multi-collapse-' + index">
                                                    <tbody>
                                                        <thead class="d-flex flex-wrap">
                                                            <th class="col-4 justify-content-center" scope="col">Pitcher</th>
                                                            <th class="col-2 justify-content-center" scope="col">Innings Pitched</th>
                                                            <th class="col-2 justify-content-center" scope="col">Runs Allowed</th>
                                                            <th class="col-2 justify-content-center" scope="col">SO</th>
                                                            <th class="col-2 justify-content-center" scope="col">ERA</th>
                                                        </thead>

                                                        <div v-for="playerStats in props_box_game_scores_mlb[index].data.gameboxscore.awayTeam.awayPlayers.playerEntry">
                                                                <tr v-if="playerStats.player.Position === 'P'" class="d-flex" v-bind:data-player-id="playerStats.player.ID">
                                                                    <td class="col-4 justify-content-center" v-bind:data-player-id="playerStats.player.ID" scope="row" title="Click for Season Stats">
                                                                        {{playerStats.player.FirstName}} {{playerStats.player.LastName}} 
                                                                    <span v-if="playerStats.stats.Wins['#text'] === '1'">(W)</span> 
                                                                    <span v-else-if="playerStats.stats.Losses['#text'] === '1'">(L)</span> 
                                                                    <span v-else-if="playerStats.stats.Saves['#text'] === '1'">(S)</span>  
                                                                    </td>
                                                                    
                                                                    <td class="col-2 justify-content-center" justify-content="center">
                                                                        {{playerStats.stats.InningsPitched['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.RunsAllowed['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.PitcherStrikeouts['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.EarnedRunAvg['#text']}}
                                                                    </td>
                                                                </tr>

                                                                <pitcher-season-stats v-bind:props_player_id="playerStats.player.ID"></pitcher-season-stats>
                                                                
                                                        </div>
                                                    </tbody>
                                                </table>
                                                <!-- ========= End Pitcher Stats ============== -->


                                                <!-- ======== Home Team Boxscore =================== -->
                                                <table @click="emitPlayerSeasonStatsClicked($event)" class="table table-striped table-bordered table-hover table-sm collapse" v-bind:class="'multi-collapse-' + index">
                                                    <tbody>
                                                        <thead class="d-flex flex-wrap">
                                                        <th class="col-12">
                                                            {{ props_box_game_scores_mlb[index].data.gameboxscore.game.homeTeam.City }} {{ props_box_game_scores_mlb[index].data.gameboxscore.game.homeTeam.Name }}:
                                                        </th>
                                                            <th class="col-4 justify-content-center" scope="col">Player</th>
                                                            <th class="col-2 justify-content-center" scope="col">Hits</th>
                                                            <th class="col-2 justify-content-center" scope="col">HR's</th>
                                                            <th class="col-2 justify-content-center" scope="col">R/Avg</th>
                                                            <th class="col-2 justify-content-center" scope="col">RBI's</th>
                                                        </thead>

                                                        <div v-for="playerStats in props_box_game_scores_mlb[index].data.gameboxscore.homeTeam.homePlayers.playerEntry">
                                                                <tr v-if="playerStats.stats.AtBats['#text'] > 0" class="d-flex" >
                                                                    <td class="col-4 justify-content-center" v-bind:data-player-id="playerStats.player.ID" scope="row" title="Click for Season Stats">
                                                                        {{playerStats.player.FirstName}} {{playerStats.player.LastName}} ({{playerStats.player.Position}})
                                                                    </td>
                                                                    <td class="col-2 justify-content-center" justify-content="center">
                                                                        {{playerStats.stats.Hits['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.Homeruns['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.Runs['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.RunsBattedIn['#text']}}
                                                                    </td>
                                                                </tr>

                                                                <player-season-stats v-bind:props_player_id="playerStats.player.ID"></player-season-stats>
                                                        </div>
                                                    </tbody>
                                                </table>

                                                <!-- ========= Pitcher Stats ============== -->
                                                <table @click="emitPitcherSeasonStatsClicked($event)" class="table table-striped table-bordered table-hover table-sm collapse" v-bind:class="'multi-collapse-' + index">
                                                    <tbody>
                                                        <thead class="d-flex flex-wrap">
                                                            <th class="col-4 justify-content-center" scope="col">Pitcher</th>
                                                            <th class="col-2 justify-content-center" scope="col">Innings Pitched</th>
                                                            <th class="col-2 justify-content-center" scope="col">Runs Allowed</th>
                                                            <th class="col-2 justify-content-center" scope="col">SO</th>
                                                            <th class="col-2 justify-content-center" scope="col">ERA</th>
                                                        </thead>

                                                        <div
                                                            v-for="playerStats in props_box_game_scores_mlb[index].data.gameboxscore.homeTeam.homePlayers.playerEntry">
                                                                <tr v-if="playerStats.player.Position === 'P'" class="d-flex" v-bind:data-player-id="playerStats.player.ID">
                                                                    <td class="col-4 justify-content-center" v-bind:data-player-id="playerStats.player.ID" scope="row" title="Click for Season Stats">
                                                                        {{playerStats.player.FirstName}} {{playerStats.player.LastName}}
                                                                    <span v-if="playerStats.stats.Wins['#text'] === '1'">(W)</span> 
                                                                    <span v-else-if="playerStats.stats.Losses['#text'] === '1'">(L)</span> 
                                                                    <span v-else-if="playerStats.stats.Saves['#text'] === '1'">(S)</span>  
                                                                    </td>
                                                                    
                                                                    <td class="col-2 justify-content-center" justify-content="center">
                                                                        {{playerStats.stats.InningsPitched['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.RunsAllowed['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.PitcherStrikeouts['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.EarnedRunAvg['#text']}}
                                                                    </td>
                                                                </tr>
                                                            
                                                                <pitcher-season-stats v-bind:props_player_id="playerStats.player.ID"></pitcher-season-stats>
                                                                
                                                        </div>
                                                    </tbody>
                                                </table>
                                                <!-- ========= End Pitcher Stats ============== -->
                                            </div> <!-- End div v-if -->
 <!-- =============================================== End v-if for MLB Boxscores =============================================== -->


 <!-- =============================================== Begin v-else-if for MLB Boxscores =============================================== -->

                                           <!-- ===== Now if arrays are not equal length we must provide logic to handle
                                                this situation. 
                                            ============= -->
                                            <div v-else-if="index < props_box_game_scores_mlb.length && props_box_game_scores_mlb[index].data.gameboxscore.game.location === props_league_data[index].game.location">      
                                                <p> 
                                                    <button class="btn-sm btn-outline-dark" type="button" data-toggle="collapse"
                                                        v-bind:data-target="'.multi-collapse-' + index" aria-expanded="false"
                                                        aria-controls="collapseExample">
                                                        Game Stats
                                                    </button>
                                                </p>

                                                <!-- ======== Away Team Boxscore =================== -->
                                                <table @click="emitPlayerSeasonStatsClicked($event)" class="table table-striped table-bordered table-hover table-sm collapse" v-bind:class="'multi-collapse-' + index">
                                                    <tbody>
                                                        <thead class="d-flex flex-wrap">
                                                        <th class="col-12">
                                                            {{ props_box_game_scores_mlb[index].data.gameboxscore.game.awayTeam.City }} {{ props_box_game_scores_mlb[index].data.gameboxscore.game.awayTeam.Name }}:
                                                        </th>
                                                            <th class="col-4 justify-content-center" scope="col">Player</th>
                                                            <th class="col-2 justify-content-center" scope="col">Hits</th>
                                                            <th class="col-2 justify-content-center" scope="col">HR's</th>
                                                            <th class="col-2 justify-content-center" scope="col">R/Avg</th>
                                                            <th class="col-2 justify-content-center" scope="col">RBI's</th>
                                                        </thead>

                                                        <div
                                                            v-for="playerStats in props_box_game_scores_mlb[index].data.gameboxscore.awayTeam.awayPlayers.playerEntry">
                                                                <tr v-if="playerStats.stats.AtBats['#text'] > 0" class="d-flex">
                                                                    <td class="col-4 justify-content-center" :data-player-id='playerStats.player.ID' scope="row" title="Click for Season Stats">
                                                                        {{playerStats.player.FirstName}} {{playerStats.player.LastName}} ({{playerStats.player.Position}})
                                                                    </td>
                                                                    <td class="col-2 justify-content-center" justify-content="center">
                                                                        {{playerStats.stats.Hits['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.Homeruns['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.Runs['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.RunsBattedIn['#text']}}
                                                                    </td>
                                                                </tr>

                                                                <player-season-stats v-bind:props_player_id="playerStats.player.ID"></player-season-stats>
                                                        </div>
                                                    </tbody>
                                                </table>

                                                <!-- ========= Pitcher Stats ============== -->
                                                <table  @click="emitPitcherSeasonStatsClicked($event)" class="table table-striped table-bordered table-hover table-sm collapse" v-bind:class="'multi-collapse-' + index">
                                                    <tbody>
                                                        <thead class="d-flex flex-wrap">
                                                            <th class="col-4 justify-content-center" scope="col">Pitcher</th>
                                                            <th class="col-2 justify-content-center" scope="col">Innings Pitched</th>
                                                            <th class="col-2 justify-content-center" scope="col">Runs Allowed</th>
                                                            <th class="col-2 justify-content-center" scope="col">SO</th>
                                                            <th class="col-2 justify-content-center" scope="col">ERA</th>
                                                        </thead>

                                                        <div
                                                            v-for="playerStats in props_box_game_scores_mlb[index].data.gameboxscore.awayTeam.awayPlayers.playerEntry">
                                                                <tr v-if="playerStats.player.Position === 'P'" class="d-flex" v-bind:data-player-id="playerStats.player.ID">
                                                                    <td class="col-4 justify-content-center" v-bind:data-player-id="playerStats.player.ID" scope="row" title="Click for Season Stats">
                                                                        {{playerStats.player.FirstName}} {{playerStats.player.LastName}} 
                                                                        <span v-if="playerStats.stats.Wins['#text'] === '1'">(W)</span> 
                                                                        <span v-else-if="playerStats.stats.Losses['#text'] === '1'">(L)</span> 
                                                                        <span v-else-if="playerStats.stats.Saves['#text'] === '1'">(S)</span>  
                                                                    </td>
                                                                    
                                                                    <td class="col-2 justify-content-center" justify-content="center">
                                                                        {{playerStats.stats.InningsPitched['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.RunsAllowed['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.PitcherStrikeouts['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.EarnedRunAvg['#text']}}
                                                                    </td>
                                                                </tr>

                                                                <pitcher-season-stats v-bind:props_player_id="playerStats.player.ID"></pitcher-season-stats>
                                                        </div>
                                                    </tbody>
                                                </table>
                                                <!-- ========= End Pitcher Stats ============== -->

                                                <!-- ======== Home Team Boxscore =================== -->
                                                <table @click="emitPlayerSeasonStatsClicked($event)" class="table table-striped table-bordered  table-hover table-sm collapse" v-bind:class="'multi-collapse-' + index">
                                                    <tbody>
                                                        <thead class="d-flex flex-wrap">
                                                            <th class="col-12">
                                                                {{ props_box_game_scores_mlb[index].data.gameboxscore.game.homeTeam.City }} {{ props_box_game_scores_mlb[index].data.gameboxscore.game.homeTeam.Name }}:
                                                            </th>
                                                            <th class="col-4 justify-content-center" scope="col">Player</th>
                                                            <th class="col-2 justify-content-center" scope="col">Hits</th>
                                                            <th class="col-2 justify-content-center" scope="col">HR's</th>
                                                            <th class="col-2 justify-content-center" scope="col">R/Avg</th>
                                                            <th class="col-2 justify-content-center" scope="col">RBI's</th>
                                                        </thead>

                                                        <div
                                                            v-for="playerStats in props_box_game_scores_mlb[index].data.gameboxscore.homeTeam.homePlayers.playerEntry">
                                                                <tr v-if="playerStats.stats.AtBats['#text'] > 0" class="d-flex">
                                                                    <td class="col-4 justify-content-center" v-bind:data-player-id="playerStats.player.ID" scope="row" title="Click for Season Stats">
                                                                        {{playerStats.player.FirstName}} {{playerStats.player.LastName}} ({{playerStats.player.Position}})
                                                                    </td>
                                                                    <td class="col-2 justify-content-center" justify-content="center">
                                                                        {{playerStats.stats.Hits['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.Homeruns['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.Runs['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.RunsBattedIn['#text']}}
                                                                    </td>
                                                                </tr>

                                                                <player-season-stats v-bind:props_player_id="playerStats.player.ID"></player-season-stats>
                                                        </div>
                                                    </tbody>
                                                </table>

                                                <!-- ========= Pitcher Stats ============== -->
                                                <table @click="emitPitcherSeasonStatsClicked($event)" class="table table-striped table-bordered  table-hover table-sm collapse" v-bind:class="'multi-collapse-' + index">
                                                    <tbody>
                                                        <thead class="d-flex flex-wrap">
                                                            <th class="col-4 justify-content-center" scope="col">Pitcher</th>
                                                            <th class="col-2 justify-content-center" scope="col">Innings Pitched</th>
                                                            <th class="col-2 justify-content-center" scope="col">Runs Allowed</th>
                                                            <th class="col-2 justify-content-center" scope="col">SO</th>
                                                            <th class="col-2 justify-content-center" scope="col">ERA</th>
                                                        </thead>

                                                        <div
                                                            v-for="playerStats in props_box_game_scores_mlb[index].data.gameboxscore.homeTeam.homePlayers.playerEntry">
                                                                <tr v-if="playerStats.player.Position === 'P'" class="d-flex" v-bind:data-player-id="playerStats.player.ID">
                                                                    <td class="col-4 justify-content-center" v-bind:data-player-id="playerStats.player.ID" scope="row" title="Click for Season Stats">
                                                                        {{playerStats.player.FirstName}} {{playerStats.player.LastName}}
                                                                    <span v-if="playerStats.stats.Wins['#text'] === '1'">(W)</span> 
                                                                    <span v-else-if="playerStats.stats.Losses['#text'] === '1'">(L)</span> 
                                                                    <span v-else-if="playerStats.stats.Saves['#text'] === '1'">(S)</span>  
                                                                    </td>
                                                                    
                                                                    <td class="col-2 justify-content-center" justify-content="center">
                                                                        {{playerStats.stats.InningsPitched['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.RunsAllowed['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.PitcherStrikeouts['#text']}}</td>
                                                                    <td class="col-2 justify-content-center">{{playerStats.stats.EarnedRunAvg['#text']}}
                                                                    </td>
                                                                </tr>

                                                                <pitcher-season-stats v-bind:props_player_id="playerStats.player.ID"></pitcher-season-stats>
                                                        </div>
                                                    </tbody>
                                                </table>
                                                <!-- ========= End Pitcher Stats ============== -->
                                            </div>
<!-- =============================================== End v-else-if for MLB Boxscores ============================================ -->
         <!-- index value is higher then props_box_game_scores_mlb.length so must be an incomplete game. No boxscore available === -->
                                            <div v-else>
                                                <p> No Boxscores Available. </p>
                                            </div>
                                        
                                    <!-- ==================== End Markup for Game Boxscores ============================ -->

                                </div> <!-- End v-for Box Scores-->
                            </div> <!-- End of row -->
                        </div> <!-- End container -->
                        <!-- ============== End of Markup for Divisional Regular Season Daily Scores =============== -->
                
                        <hr>
                        <!-- ------------------------------------------------------------------------------------------------------ -->
                
                        <!-- ============== Markup for Regular/Divisional Season Standings =============== -->
                        <div class="container">
                            <div v-if="props_baseball_playoffs === false">
                                <div class="row">
                                    <div class="col-xs-12 col-md-4 division-name" v-for="value in props_league_standings">
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
                                                        <td class="team" v-if="item.stats.WinPct['#text']">
                                                            {{ item.stats.WinPct['#text'].slice(1) }}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div> <!-- End item in value.teamentry -->
                                    </div> <!-- End v-for props_league_standings -->
                                </div> <!-- End of row -->
                            </div> <!-- End v-if props_league_playoffs -->
                        </div> <!-- ======= End container ============ -->
                        <!-- ============== End of Markup for Divional/Regular Season Scores =============== -->
                
                
                    </div> <!-- End main else -->
                
                </div> <!-- End Vue root -->
            ` // End Template Literal
  })
};

module.exports = {
  mlb
};
