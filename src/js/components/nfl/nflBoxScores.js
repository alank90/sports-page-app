const Vue = require("vue");
const cumulativeQBSeasonStats = require("./cumulativeQBSeasonStats");
const cumulativeReceivingSeasonStats = require("./cumlativeReceivingSeasonStats");
const cumulativeRushingSeasonStats = require("./cumullativeRushingSeasonStats");
const cumulativeDefensiveSeasonStats = require("./cumulativeDefensiveSeasonStats");

const { EventBus } = require("../../modules/event-bus");

const boxScoresStats = {
  stats: Vue.component("box-scores", {
    props: ["props_box_score", "props_gameID"],
    components: {
      cumulativeQBSeasonStats: cumulativeQBSeasonStats,
      cumulativeReceivingSeasonStats: cumulativeReceivingSeasonStats,
      cumulativeRushingSeasonStats: cumulativeRushingSeasonStats,
      cumulativeDefensiveSeasonStats: cumulativeDefensiveSeasonStats
    },
    data: function() {
      return {
        playerStatsAway: this.props_box_score.data.gameboxscore.awayTeam
          .awayPlayers.playerEntry,
        offensivePlayersAway: this.props_box_score.data.gameboxscore.awayTeam.awayPlayers.playerEntry.filter(
          offensivePlayer =>
            offensivePlayer.player.Position === "QB" ||
            offensivePlayer.player.Position === "WR" ||
            offensivePlayer.player.Position === "RB" ||
            offensivePlayer.player.Position === "TE"
        ),
        defensivePlayersAway: this.props_box_score.data.gameboxscore.awayTeam.awayPlayers.playerEntry.filter(
          defensivePlayer =>
            defensivePlayer.player.Position === "DT" ||
            defensivePlayer.player.Position === "DE" ||
            defensivePlayer.player.Position === "LB" ||
            defensivePlayer.player.Position === "FS" ||
            defensivePlayer.player.Position === "LS" ||
            defensivePlayer.player.Position === "CB"
        ),
        playerStatsHome: this.props_box_score.data.gameboxscore.homeTeam
          .homePlayers.playerEntry,
        offensivePlayersHome: this.props_box_score.data.gameboxscore.homeTeam.homePlayers.playerEntry.filter(
          offensivePlayer =>
            offensivePlayer.player.Position === "QB" ||
            offensivePlayer.player.Position === "WR" ||
            offensivePlayer.player.Position === "RB" ||
            offensivePlayer.player.Position === "TE"
        ),
        defensivePlayersHome: this.props_box_score.data.gameboxscore.homeTeam.homePlayers.playerEntry.filter(
          defensivePlayer =>
            defensivePlayer.player.Position === "DT" ||
            defensivePlayer.player.Position === "DE" ||
            defensivePlayer.player.Position === "LB" ||
            defensivePlayer.player.Position === "FS" ||
            defensivePlayer.player.Position === "LS" ||
            defensivePlayer.player.Position === "CB"
        ),
        showPlayerSeasonStats: false
      };
    },
    computed: {
      playerPassingStatsAway: function() {
        return this.offensivePlayersAway.filter(playerEntry => {
          if (
            typeof playerEntry.stats.PassYards != "undefined" &&
            playerEntry.stats.PassAttempts["#text"] > "0"
          ) {
            return playerEntry.stats.PassYards["#text"] > "0";
          }
        });
      },
      playerReceivingStatsAway: function() {
        return this.offensivePlayersAway
          .filter(playerEntry => {
            if (typeof playerEntry.stats.RecYards != "undefined") {
              return playerEntry.stats.RecYards["#text"] > "0";
            }
          })
          .sort(function(a, b) {
            return b.stats.Receptions["#text"] - a.stats.Receptions["#text"];
          });
      },
      playerRushingStatsAway: function() {
        return this.offensivePlayersAway
          .filter(playerEntry => {
            if (typeof playerEntry.stats.RushYards != "undefined") {
              return playerEntry.stats.RushYards["#text"] > "0";
            }
          })
          .sort(function(a, b) {
            return b.stats.RushYards["#text"] - a.stats.RushYards["#text"];
          });
      },
      playerDefensiveStatsAway: function() {
        return this.defensivePlayersAway
          .filter(playerEntry => {
            if (typeof playerEntry.stats.TackleTotal != "undefined") {
              return (
                playerEntry.stats.TackleTotal["#text"] > "3" ||
                playerEntry.stats.Interceptions["#text"] > "0"
              );
            }
          })
          .sort(function(a, b) {
            return b.stats.TackleTotal["#text"] - a.stats.TackleTotal["#text"];
          });
      },
      playerPassingStatsHome: function() {
        return this.offensivePlayersHome.filter(playerEntry => {
          if (typeof playerEntry.stats.PassYards != "undefined") {
            return playerEntry.stats.PassYards["#text"] > "0";
          }
        });
      },
      playerReceivingStatsHome: function() {
        return this.offensivePlayersHome
          .filter(playerEntry => {
            if (typeof playerEntry.stats.RecYards != "undefined") {
              return playerEntry.stats.RecYards["#text"] > "0";
            }
          })
          .sort(function(a, b) {
            return b.stats.Receptions["#text"] - a.stats.Receptions["#text"];
          });
      },
      playerRushingStatsHome: function() {
        return this.offensivePlayersHome
          .filter(playerEntry => {
            if (typeof playerEntry.stats.RushYards != "undefined") {
              return playerEntry.stats.RushYards["#text"] > "0";
            }
          })
          .sort(function(a, b) {
            return b.stats.RushYards["#text"] - a.stats.RushYards["#text"];
          });
      },
      playerDefensiveStatsHome: function() {
        return this.defensivePlayersHome
          .filter(playerEntry => {
            if (typeof playerEntry.stats.TackleTotal != "undefined") {
              return (
                playerEntry.stats.TackleTotal["#text"] > "3" ||
                playerEntry.stats.Interceptions["#text"] > "0"
              );
            }
          })
          .sort(function(a, b) {
            return b.stats.TackleTotal["#text"] - a.stats.TackleTotal["#text"];
          });
      },
      teamColorAway: function() {
        return this.props_box_score.data.gameboxscore.game.awayTeam.Abbreviation.toLowerCase();
      },
      teamColorHome: function() {
        return this.props_box_score.data.gameboxscore.game.homeTeam.Abbreviation.toLowerCase();
      }
    },
    methods: {
      emitQBSeasonStatsClicked: function($event) {
        let playerId = $event.target.dataset.playerId;
        EventBus.$emit("showQBTemplateClicked", playerId);
      },
      emitReceivingSeasonStatsClicked: function($event) {
        let playerId = $event.target.dataset.playerId;
        EventBus.$emit("showReceivingTemplateClicked", playerId);
      },
      emitRushingSeasonStatsClicked: function($event) {
        let playerId = $event.target.dataset.playerId;
        EventBus.$emit("showRushingTemplateClicked", playerId);
      },
      emitDefensiveSeasonStatsClicked: function($event) {
        let playerId = $event.target.dataset.playerId;
        EventBus.$emit("showDefensiveTemplateClicked", playerId);
      }
    },
    template: `
        <div v-if="props_box_score">
                <button class="btn-sm btn-outline-dark" type="button" data-toggle="collapse" 
                    :data-target="'.collapse' + props_gameID"  aria-expanded="false"
                    :aria-controls="props_gameID">
                    Game Stats
                </button> 
                
                <!-- ========== Begin AwayTeam Markup ================ -->
                <div 
                 class="collapse" :class="'collapse' + props_gameID">
                    <!-- ======== Away Team Offense Stats ============= -->
                    <table class="table table-striped table-bordered table-hover table-sm">
                        <tbody class="table table-striped">
                            <!-- ============= Passing Stats ============ -->
                                <thead class="d-flex flex-wrap">
                                    <th class="col-12" :class="teamColorAway">
                                    {{ props_box_score.data.gameboxscore.game.awayTeam.City }} {{ props_box_score.data.gameboxscore.game.awayTeam.Name }}
                                    </th>
                                  
                                    <th class="col-12 stats-header"> Passing Stats </th>
                                    <th class="col-3 justify-content-center" scope="col">Player</th>
                                    <th class="col-3 justify-content-center" scope="col">CP/Att</th>
                                    <th class="col-2 justify-content-center" scope="col">Yds</th>
                                    <th class="col-2 justify-content-center" scope="col">TD</th>
                                    <th class="col-2 justify-content-center" scope="col">Int</th>
                                   
                                </thead>
                                               
                                <div v-for="playerStats in playerPassingStatsAway">
                                  <tr  @click="emitQBSeasonStatsClicked($event)" class="d-flex">
                                      <td class="col-3 justify-content-center" :data-player-id="playerStats.player.ID" scope="row" title="Click for Season Stats">
                                      {{playerStats.player.FirstName}} {{playerStats.player.LastName}} ({{playerStats.player.Position}})
                                      </td>
                                      <td class="col-3 justify-content-center" justify-content="center">
                                          {{ playerStats.stats.PassCompletions['#text'] }} / {{ playerStats.stats.PassAttempts['#text'] }} </td>
                                      <td class="col-2 justify-content-center">{{playerStats.stats.PassYards['#text']}}</td>
                                      <td class="col-2 justify-content-center">{{playerStats.stats.PassTD['#text']}}</td>
                                      <td class="col-2 justify-content-center">{{playerStats.stats.IntTD['#text']}}
                                      </td>                 
                                </tr>

                                <qb-season-stats v-bind:props_player_id="playerStats.player.ID"></qb-season-stats>
                               
                                </div> <!-- End v-for playerPassingStatsAway -->
                                <!-- ============= End Passing Stats ============ -->               

                         </tbody>
                    </table>
                                                            
                                        <!-- ============= Receiving Stats ============ -->
                                        <table class="table table-striped table-bordered table-hover table-sm">
                                                <tbody class="table table-striped">
                                                    <!-- ============= Recvg Stats ============ -->
                                                        <thead class="d-flex flex-wrap">
                                                            <th class="col-12 stats-header"> Receiving Stats </th>
                                                            <th class="col-3 justify-content-center" scope="col">Player</th>
                                                            <th class="col-2 justify-content-center" scope="col">Rec</th>
                                                            <th class="col-2 justify-content-center" scope="col">Yds</th>
                                                            <th class="col-2 justify-content-center" scope="col">TD</th>
                                                            <th class="col-3 justify-content-center" scope="col">Tgts</th>
                                                        </thead>

                                                        <div v-for="playerStats in playerReceivingStatsAway">
                                                            <tr @click="emitReceivingSeasonStatsClicked($event)" class="d-flex">
                                                                <td class="col-3 justify-content-center" :data-player-id="playerStats.player.ID" title="Click for Season Stats" scope="row">
                                                                {{playerStats.player.FirstName}} {{playerStats.player.LastName}} ({{playerStats.player.Position}})
                                                                </td>
                                                                <td class="col-2 justify-content-center" justify-content="center">
                                                                    {{ playerStats.stats.Receptions['#text'] }} </td>
                                                                <td class="col-2 justify-content-center">{{playerStats.stats.RecYards['#text']}}</td>
                                                                <td class="col-2 justify-content-center">{{playerStats.stats.RecTD['#text']}}</td>
                                                                <td class="col-3 justify-content-center">{{playerStats.stats.Targets['#text']}}</td>
                                                            </tr>

                                                            <receiving-season-stats v-bind:props_player_id="playerStats.player.ID"></receiving-season-stats>
                                                        
                                                        </div>  <!-- End v-for playerStats -->
                                                </tbody>
                                        </table>
                                        <!-- ============= End Receiving Stats ============ -->


                                        <!-- ============= Start Rushing Stats ============ -->
                                        <table class="table table-striped table-bordered table-hover table-sm">
                                                <tbody class="table table-striped">
                                                    <!-- ============= Receiving Stats ============ -->
                                                        <thead class="d-flex flex-wrap">
                                                            <th class="col-12 stats-header"> Rushing Stats </th>
                                                            <th class="col-3 justify-content-center" scope="col">Player</th>
                                                            <th class="col-2 justify-content-center" scope="col">Yds</th>
                                                            <th class="col-3 justify-content-center" scope="col">Avg</th>
                                                            <th class="col-2 justify-content-center" scope="col">TD</th>
                                                            <th class="col-2 justify-content-center" scope="col">Lng</th>
                                                        </thead>

                                                    <div v-for="playerStats in playerRushingStatsAway">
                                                            <tr @click="emitRushingSeasonStatsClicked($event)" class="d-flex">
                                                                <td class="col-3 justify-content-center" :data-player-id="playerStats.player.ID" title="Click for Season Stats" scope="row">
                                                                {{playerStats.player.FirstName}} {{playerStats.player.LastName}} ({{playerStats.player.Position}})
                                                                </td>
                                                                <td class="col-2 justify-content-center" justify-content="center">
                                                                    {{ playerStats.stats.RushYards['#text'] }} </td>
                                                                <td class="col-3 justify-content-center">{{playerStats.stats.RushAverage['#text']}}</td>
                                                                <td class="col-2 justify-content-center">{{playerStats.stats.RushTD['#text']}}</td>
                                                                <td class="col-2 justify-content-center">{{playerStats.stats.RushLng['#text']}}</td>
                                                            </tr>
                                                            
                                                            <rushing-season-stats v-bind:props_player_id="playerStats.player.ID"></rushing-season-stats>

                                                    </div> <!-- End v-for playerStatsAway for Rushing -->

                                                </tbody>
                                        </table>

                                        <!-- ============= End Rushing Stats ================ -->

                                        <!-- =============== Start AwayDefensive Stats ================ -->
                                        <table class="table table-striped table-bordered table-hover table-sm">
                                                <tbody class="table table-striped">
                                                    <!-- ============= Defensive Stats ============ -->
                                                        <thead class="d-flex flex-wrap">
                                                            <th class="col-12 stats-header"> Defensive Stats </th>
                                                            <th class="col-3 justify-content-center" scope="col">Player</th>
                                                            <th class="col-2 justify-content-center" scope="col">Tkls</th>
                                                            <th class="col-3 justify-content-center" scope="col">Scks</th>
                                                            <th class="col-2 justify-content-center" scope="col">Int</th>
                                                            <th class="col-2 justify-content-center" scope="col">FF</th>
                                                        </thead>

                                                    <div v-for="playerStats in playerDefensiveStatsAway">
                                                        <tr @click="emitDefensiveSeasonStatsClicked($event)" class="d-flex">
                                                            <td class="col-3 justify-content-center" :data-player-id="playerStats.player.ID" title="Click for Season Stats" scope="row">
                                                            {{playerStats.player.FirstName}} {{playerStats.player.LastName}} ({{playerStats.player.Position}})
                                                            </td>
                                                            <td class="col-2 justify-content-center" justify-content="center">
                                                                {{ playerStats.stats.TackleTotal['#text'] }} </td>
                                                            <td class="col-3 justify-content-center">{{playerStats.stats.Sacks['#text']}}</td>
                                                            <td class="col-2 justify-content-center">{{playerStats.stats.Interceptions['#text']}}</td>
                                                            <td class="col-2 justify-content-center">{{playerStats.stats.FumForced['#text']}}</td>
                                                        </tr>

                                                        <defensive-season-stats v-bind:props_player_id="playerStats.player.ID"></defensive-season-stats>

                                                    </div> <!-- End v-for playerStatsAway for Rushing -->

                                                </tbody>
                                        </table>
                                  
            </div> <!-- End awayTeam Div -->
            <!-- ================================================================================ -->
            <!-- =================== End AwayTeam Markup ======================================== -->
            <!-- ================================================================================ -->

  <!-- --------------------------------------------------------------------------------------------------------------------------------------- -->
            <!-- ================================================================================ -->
            <!-- =================== Begin HomeTeam Markup ====================================== -->
            <!-- ================================================================================ -->  
            
            <!-- ========== Begin HomeTeam Markup ================ -->
                <div 
                 class="collapse" :class="'collapse' + props_gameID">
                    <!-- ======== Home Team Offense Stats ============= -->
                    <table @click="emitQBSeasonStatsClicked($event)" class="table table-striped table-bordered table-hover table-sm">
                        <tbody class="table table-striped">
                            <!-- ============= Passing Stats ============ -->
                                <thead class="d-flex flex-wrap">
                                    <th class="col-12" :class="teamColorHome">
                                    {{ props_box_score.data.gameboxscore.game.homeTeam.City }} {{ props_box_score.data.gameboxscore.game.homeTeam.Name }}
                                    </th>
                                    <th class="col-12 stats-header"> Passing Stats </th>
                                    <th class="col-3 justify-content-center" scope="col">Player</th>
                                    <th class="col-3 justify-content-center" scope="col">CP/Att</th>
                                    <th class="col-2 justify-content-center" scope="col">Yds</th>
                                    <th class="col-2 justify-content-center" scope="col">TD</th>
                                    <th class="col-2 justify-content-center" scope="col">Int</th>
                                </thead>
                            <div v-for="playerStats in playerPassingStatsHome">
                                    <tr class="d-flex">
                                        <td class="col-3 justify-content-center" :data-player-id="playerStats.player.ID" scope="row" title="Click for Season Stats">
                                        {{playerStats.player.FirstName}} {{playerStats.player.LastName}} ({{playerStats.player.Position}})
                                        </td>
                                        <td class="col-3 justify-content-center" justify-content="center">
                                            {{ playerStats.stats.PassCompletions['#text'] }} / {{ playerStats.stats.PassAttempts['#text'] }} </td>
                                        <td class="col-2 justify-content-center">{{playerStats.stats.PassYards['#text']}}</td>
                                        <td class="col-2 justify-content-center">{{playerStats.stats.PassTD['#text']}}</td>
                                        <td class="col-2 justify-content-center">{{playerStats.stats.IntTD['#text']}}
                                        </td>                 
                                    </tr>

                                    <qb-season-stats v-bind:props_player_id="playerStats.player.ID"></qb-season-stats>

                            </div> <!-- End v-for playerPassingStats -->
                        <!-- ============= End Passing Stats ============ -->

                        </tbody>
                    </table>
                
                <!-- ============= Receiving Stats ============ -->
                <table class="table table-striped table-bordered table-hover table-sm">
                        <tbody class="table table-striped">
                            <!-- ============= Recvg Stats ============ -->
                                <thead class="d-flex flex-wrap">
                                    <th class="col-12 stats-header"> Receiving Stats </th>
                                    <th class="col-3 justify-content-center" scope="col">Player</th>
                                    <th class="col-2 justify-content-center" scope="col">Rec</th>
                                    <th class="col-2 justify-content-center" scope="col">Yds</th>
                                    <th class="col-2 justify-content-center" scope="col">TD</th>
                                    <th class="col-3 justify-content-center" scope="col">Tgts</th>
                                </thead>
                                <div v-for="playerStats in playerReceivingStatsHome">
                                    <tr @click="emitReceivingSeasonStatsClicked($event)" class="d-flex">
                                        <td class="col-3 justify-content-center" :data-player-id="playerStats.player.ID" title="Click for Season Stats" scope="row">
                                        {{playerStats.player.FirstName}} {{playerStats.player.LastName}} ({{playerStats.player.Position}})
                                        </td>
                                        <td class="col-2 justify-content-center" justify-content="center">
                                            {{ playerStats.stats.Receptions['#text'] }} </td>
                                        <td class="col-2 justify-content-center">{{playerStats.stats.RecYards['#text']}}</td>
                                        <td class="col-2 justify-content-center">{{playerStats.stats.RecTD['#text']}}</td>
                                        <td class="col-3 justify-content-center">{{playerStats.stats.Targets['#text']}}</td>
                                    </tr>

                                    <receiving-season-stats v-bind:props_player_id="playerStats.player.ID"></receiving-season-stats>

                                </div>  <!-- End v-for playerStats -->
                        </tbody>
                </table>
                <!-- ============= End Receiving Stats ============ -->


                <!-- ============= Start Rushing Stats ============ -->
                <table class="table table-striped table-bordered table-hover table-sm">
                        <tbody class="table table-striped">
                            <!-- ============= Rushing Stats ============ -->
                                <thead class="d-flex flex-wrap">
                                    <th class="col-12 stats-header"> Rushing Stats </th>
                                    <th class="col-3 justify-content-center" scope="col">Player</th>
                                    <th class="col-2 justify-content-center" scope="col">Yds</th>
                                    <th class="col-3 justify-content-center" scope="col">Avg</th>
                                    <th class="col-2 justify-content-center" scope="col">TD</th>
                                    <th class="col-2 justify-content-center" scope="col">Lng</th>
                                </thead>

                            <div v-for="playerStats in playerRushingStatsHome">
                                    <tr  @click="emitRushingSeasonStatsClicked($event)" class="d-flex">
                                        <td class="col-3 justify-content-center" :data-player-id="playerStats.player.ID" title="Click for Season Stats" scope="row">
                                        {{playerStats.player.FirstName}} {{playerStats.player.LastName}} ({{playerStats.player.Position}})
                                        </td>
                                        <td class="col-2 justify-content-center" justify-content="center">
                                            {{ playerStats.stats.RushYards['#text'] }} </td>
                                        <td class="col-3 justify-content-center">{{playerStats.stats.RushAverage['#text']}}</td>
                                        <td class="col-2 justify-content-center">{{playerStats.stats.RushTD['#text']}}</td>
                                        <td class="col-2 justify-content-center">{{playerStats.stats.RushLng['#text']}}</td>
                                    </tr>

                                    <rushing-season-stats v-bind:props_player_id="playerStats.player.ID"></rushing-season-stats>

                            </div> <!-- End v-for playerStats for Rushing -->

                        </tbody>
                </table>

                <!-- ============= End Rushing Stats ============== -->

                <!-- =============== Start HomeDefensive Stats ================ -->
                <table class="table table-striped table-bordered table-hover table-sm">
                        <tbody class="table table-striped">
                            <!-- ============= Defensive Stats ============ -->
                                <thead class="d-flex flex-wrap">
                                    <th class="col-12 stats-header"> Defensive Stats </th>
                                    <th class="col-3 justify-content-center" scope="col">Player</th>
                                    <th class="col-2 justify-content-center" scope="col">Tkls</th>
                                    <th class="col-3 justify-content-center" scope="col">Scks</th>
                                    <th class="col-2 justify-content-center" scope="col">Int</th>
                                    <th class="col-2 justify-content-center" scope="col">FF</th>
                                </thead>

                            <div v-for="playerStats in playerDefensiveStatsHome">
                                <tr @click="emitDefensiveSeasonStatsClicked($event)" class="d-flex">
                                    <td class="col-3 justify-content-center" :data-player-id="playerStats.player.ID" title="Click for Season Stats" scope="row">
                                    {{playerStats.player.FirstName}} {{playerStats.player.LastName}} ({{playerStats.player.Position}})
                                    </td>
                                    <td class="col-2 justify-content-center" justify-content="center">
                                        {{ playerStats.stats.TackleTotal['#text'] }} </td>
                                    <td class="col-3 justify-content-center">{{playerStats.stats.Sacks['#text']}}</td>
                                    <td class="col-2 justify-content-center">{{playerStats.stats.Interceptions['#text']}}</td>
                                    <td class="col-2 justify-content-center">{{playerStats.stats.FumForced['#text']}}</td>
                                </tr>

                                <defensive-season-stats v-bind:props_player_id="playerStats.player.ID"></defensive-season-stats>
                            
                                </div> <!-- End v-for playerStatsAway for Rushing -->

                        </tbody>
                </table>
                
         
            </div> <!-- End HomeTeam Div -->

            <!-- ================================================================================ -->
            <!-- =================== End HomeTeam Markup ====================================== -->
            <!-- ================================================================================ -->  

        </div> <!-- End Template div -->
       
                          
        ` // End template
  })
};

module.export = { boxScoresStats };
