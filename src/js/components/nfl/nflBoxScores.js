const Vue = require("vue");
const axios = require("axios");

const boxScoresStats = {
  stats: Vue.component("box-scores", {
    props: ["props_box_score", "props_gameID"],
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
        playerStatsHome: this.props_box_score.data.gameboxscore.homeTeam
          .homePlayers.playerEntry,
        offensivePlayersHome: this.props_box_score.data.gameboxscore.homeTeam.homePlayers.playerEntry.filter(
          offensivePlayer =>
            offensivePlayer.player.Position === "QB" ||
            offensivePlayer.player.Position === "WR" ||
            offensivePlayer.player.Position === "RB" ||
            offensivePlayer.player.Position === "TE"
        )
      };
    },
    computed: {
      playerPassingStatsAway: function() {
        return this.offensivePlayersAway.filter(playerEntry => {
          if (typeof playerEntry.stats.PassYards != "undefined") {
            return playerEntry.stats.PassYards["#text"] > "0";
          }
        });
      },
      playerReceivingStatsAway: function() {
        return this.offensivePlayersAway.filter(playerEntry => {
          if (typeof playerEntry.stats.RecYards != "undefined") {
            return playerEntry.stats.RecYards["#text"] > "0";
          }
        });
      },
      playerRushingStatsAway: function() {
        return this.offensivePlayersAway.filter(playerEntry => {
          if (typeof playerEntry.stats.RushYards != "undefined") {
            return playerEntry.stats.RushYards["#text"] > "0";
          }
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
        return this.offensivePlayersHome.filter(playerEntry => {
          if (typeof playerEntry.stats.RecYards != "undefined") {
            return playerEntry.stats.RecYards["#text"] > "0";
          }
        });
      },
      playerRushingStatsHome: function() {
        return this.offensivePlayersHome.filter(playerEntry => {
          if (typeof playerEntry.stats.RushYards != "undefined") {
            return playerEntry.stats.RushYards["#text"] > "0";
          }
        });
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
                                    <th class="col-12">
                                    {{ props_box_score.data.gameboxscore.game.awayTeam.City }} {{ props_box_score.data.gameboxscore.game.awayTeam.Name }}:
                                    </th>
                                    <th class="col-12"> Passing Stats </th>
                                    <th class="col-4 justify-content-center" scope="col">Player</th>
                                    <th class="col-4 justify-content-center" scope="col">CP/Att</th>
                                    <th class="col-2 justify-content-center" scope="col">Yds</th>
                                    <th class="col-1 justify-content-center" scope="col">TD</th>
                                    <th class="col-1 justify-content-center" scope="col">I</th>
                                </thead>
                            <div v-for="playerStats in playerPassingStatsAway">
                                    <tr class="d-flex">
                                        <td class="col-4 justify-content-center" scope="row">
                                        {{playerStats.player.FirstName}} {{playerStats.player.LastName}} ({{playerStats.player.Position}})
                                        </td>
                                        <td class="col-4 justify-content-center" justify-content="center">
                                            {{ playerStats.stats.PassCompletions['#text'] }} / {{ playerStats.stats.PassAttempts['#text'] }} </td>
                                        <td class="col-2 justify-content-center">{{playerStats.stats.PassYards['#text']}}</td>
                                        <td class="col-1 justify-content-center">{{playerStats.stats.PassTD['#text']}}</td>
                                        <td class="col-1 justify-content-center">{{playerStats.stats.IntTD['#text']}}
                                        </td>                 
                                    </tr>
                            </div> <!-- End v-for playerPassingStatsAway -->
                        <!-- ============= End Passing Stats ============ -->

                        </tbody>
                    </table>
                
                <!-- ============= Receiving Stats ============ -->
                <table class="table table-striped table-bordered table-hover table-sm">
                        <tbody class="table table-striped">
                            <!-- ============= Recvg Stats ============ -->
                                <thead class="d-flex flex-wrap">
                                    <th class="col-12"> Receiving Stats </th>
                                    <th class="col-3 justify-content-center" scope="col">Player</th>
                                    <th class="col-2 justify-content-center" scope="col">Rcpt</th>
                                    <th class="col-3 justify-content-center" scope="col">Yds</th>
                                    <th class="col-2 justify-content-center" scope="col">TD</th>
                                    <th class="col-2 justify-content-center" scope="col">T</th>
                                </thead>
                                <div v-for="playerStats in playerReceivingStatsAway">
                                    <tr class="d-flex">
                                        <td class="col-3 justify-content-center" scope="row">
                                        {{playerStats.player.FirstName}} {{playerStats.player.LastName}} ({{playerStats.player.Position}})
                                        </td>
                                        <td class="col-2 justify-content-center" justify-content="center">
                                            {{ playerStats.stats.Receptions['#text'] }} </td>
                                        <td class="col-3 justify-content-center">{{playerStats.stats.RecYards['#text']}}</td>
                                        <td class="col-2 justify-content-center">{{playerStats.stats.RecTD['#text']}}</td>
                                        <td class="col-2 justify-content-center">{{playerStats.stats.Targets['#text']}}</td>
                                    </tr>
                                </div>  <!-- End v-for playerStats -->
                        </tbody>
                </table>
                <!-- ============= End Receiving Stats ============ -->


                <!-- ============= Start Rushing Stats ============ -->
                <table class="table table-striped table-bordered table-hover table-sm">
                        <tbody class="table table-striped">
                            <!-- ============= Receiving Stats ============ -->
                                <thead class="d-flex flex-wrap">
                                    <th class="col-12"> Rushing Stats </th>
                                    <th class="col-3 justify-content-center" scope="col">Player</th>
                                    <th class="col-2 justify-content-center" scope="col">Yds</th>
                                    <th class="col-3 justify-content-center" scope="col">Avg</th>
                                    <th class="col-2 justify-content-center" scope="col">TD</th>
                                    <th class="col-2 justify-content-center" scope="col">Lng</th>
                                </thead>

                            <div v-for="playerStats in playerRushingStatsAway">
                                    <tr class="d-flex">
                                        <td class="col-3 justify-content-center" scope="row">
                                        {{playerStats.player.FirstName}} {{playerStats.player.LastName}} ({{playerStats.player.Position}})
                                        </td>
                                        <td class="col-2 justify-content-center" justify-content="center">
                                            {{ playerStats.stats.RushYards['#text'] }} </td>
                                        <td class="col-3 justify-content-center">{{playerStats.stats.RushAverage['#text']}}</td>
                                        <td class="col-2 justify-content-center">{{playerStats.stats.RushTD['#text']}}</td>
                                        <td class="col-2 justify-content-center">{{playerStats.stats.RushLng['#text']}}</td>
                                    </tr>
                            </div> <!-- End v-for playerStatsAway for Rushing -->

                        </tbody>
                </table>

                <!-- ============= End Rushing Stats ============== -->
                
         
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
                    <table class="table table-striped table-bordered table-hover table-sm">
                        <tbody class="table table-striped">
                            <!-- ============= Passing Stats ============ -->
                                <thead class="d-flex flex-wrap">
                                    <th class="col-12">
                                    {{ props_box_score.data.gameboxscore.game.homeTeam.City }} {{ props_box_score.data.gameboxscore.game.homeTeam.Name }}:
                                    </th>
                                    <th class="col-12"> Passing Stats </th>
                                    <th class="col-4 justify-content-center" scope="col">Player</th>
                                    <th class="col-4 justify-content-center" scope="col">CP/Att</th>
                                    <th class="col-2 justify-content-center" scope="col">Yds</th>
                                    <th class="col-1 justify-content-center" scope="col">TD</th>
                                    <th class="col-1 justify-content-center" scope="col">I</th>
                                </thead>
                            <div v-for="playerStats in playerPassingStatsHome">
                                    <tr class="d-flex">
                                        <td class="col-4 justify-content-center" scope="row">
                                        {{playerStats.player.FirstName}} {{playerStats.player.LastName}} ({{playerStats.player.Position}})
                                        </td>
                                        <td class="col-4 justify-content-center" justify-content="center">
                                            {{ playerStats.stats.PassCompletions['#text'] }} / {{ playerStats.stats.PassAttempts['#text'] }} </td>
                                        <td class="col-2 justify-content-center">{{playerStats.stats.PassYards['#text']}}</td>
                                        <td class="col-1 justify-content-center">{{playerStats.stats.PassTD['#text']}}</td>
                                        <td class="col-1 justify-content-center">{{playerStats.stats.IntTD['#text']}}
                                        </td>                 
                                    </tr>
                            </div> <!-- End v-for playerPassingStats -->
                        <!-- ============= End Passing Stats ============ -->

                        </tbody>
                    </table>
                
                <!-- ============= Receiving Stats ============ -->
                <table class="table table-striped table-bordered table-hover table-sm">
                        <tbody class="table table-striped">
                            <!-- ============= Recvg Stats ============ -->
                                <thead class="d-flex flex-wrap">
                                    <th class="col-12"> Receiving Stats </th>
                                    <th class="col-3 justify-content-center" scope="col">Player</th>
                                    <th class="col-2 justify-content-center" scope="col">Rcpt</th>
                                    <th class="col-3 justify-content-center" scope="col">Yds</th>
                                    <th class="col-2 justify-content-center" scope="col">TD</th>
                                    <th class="col-2 justify-content-center" scope="col">T</th>
                                </thead>
                                <div v-for="playerStats in playerReceivingStatsHome">
                                    <tr class="d-flex">
                                        <td class="col-3 justify-content-center" scope="row">
                                        {{playerStats.player.FirstName}} {{playerStats.player.LastName}} ({{playerStats.player.Position}})
                                        </td>
                                        <td class="col-2 justify-content-center" justify-content="center">
                                            {{ playerStats.stats.Receptions['#text'] }} </td>
                                        <td class="col-3 justify-content-center">{{playerStats.stats.RecYards['#text']}}</td>
                                        <td class="col-2 justify-content-center">{{playerStats.stats.RecTD['#text']}}</td>
                                        <td class="col-2 justify-content-center">{{playerStats.stats.Targets['#text']}}</td>
                                    </tr>
                                </div>  <!-- End v-for playerStats -->
                        </tbody>
                </table>
                <!-- ============= End Receiving Stats ============ -->


                <!-- ============= Start Rushing Stats ============ -->
                <table class="table table-striped table-bordered table-hover table-sm">
                        <tbody class="table table-striped">
                            <!-- ============= Receiving Stats ============ -->
                                <thead class="d-flex flex-wrap">
                                    <th class="col-12"> Rushing Stats </th>
                                    <th class="col-3 justify-content-center" scope="col">Player</th>
                                    <th class="col-2 justify-content-center" scope="col">Yds</th>
                                    <th class="col-3 justify-content-center" scope="col">Avg</th>
                                    <th class="col-2 justify-content-center" scope="col">TD</th>
                                    <th class="col-2 justify-content-center" scope="col">Lng</th>
                                </thead>

                            <div v-for="playerStats in playerRushingStatsHome">
                                    <tr class="d-flex">
                                        <td class="col-3 justify-content-center" scope="row">
                                        {{playerStats.player.FirstName}} {{playerStats.player.LastName}} ({{playerStats.player.Position}})
                                        </td>
                                        <td class="col-2 justify-content-center" justify-content="center">
                                            {{ playerStats.stats.RushYards['#text'] }} </td>
                                        <td class="col-3 justify-content-center">{{playerStats.stats.RushAverage['#text']}}</td>
                                        <td class="col-2 justify-content-center">{{playerStats.stats.RushTD['#text']}}</td>
                                        <td class="col-2 justify-content-center">{{playerStats.stats.RushLng['#text']}}</td>
                                    </tr>
                            </div> <!-- End v-for playerStats for Rushing -->

                        </tbody>
                </table>

                <!-- ============= End Rushing Stats ============== -->
                
         
            </div> <!-- End HomeTeam Div -->

            <!-- ================================================================================ -->
            <!-- =================== End HomeTeam Markup ====================================== -->
            <!-- ================================================================================ -->  

        </div> <!-- End Template div -->
       
                          
        ` // End template
  })
};

module.export = { boxScoresStats };
