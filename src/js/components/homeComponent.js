// src/js/components/home.js
const Vue = require("vue");

const Home = Vue.component("home", {
  template: `
  <div class="container">

  <h1 class="text-center inset-shadow">Scores From Around The Leagues</h1>
  <div id="sportsImages" class="title-images d-inline-flex justify-content-around fixed-top">
      <img src="./src/img/mlb-sm.jpg" alt="Pitcher Throwing Ball" />
      <img src="./src/img/nfl-sm.jpg" alt="David Tyree Superbowl Catch" />
      <img src="./src/img/nba-sm.jpg" alt="Michael Jordan Dunking" />
  </div>

  <hr class="my-2" />

  <img v-bind:src="$parent.sports_logo_image" />
  <h2 class="text-center">{{ $parent.currentTab }} Scores</h2>
  <h3 class="text-center">For {{ $parent.gameDate }}</h3>

  <!-- Error Handling Markup for API Calls -->
  <section v-if="$parent.errored">
      <p>
          We're sorry, we're not able to retrieve this information at the
          moment, please try back later
      </p>
  </section>
  <section v-else>
      <div class="loading" v-if="$parent.loading">
          Loading
          <!-- below is our font awesome icon with the class “spin-it” where 
             we have set the infinite animation:                        -->
          <i class="fas fa-spinner spin-it" aria-hidden="true"></i>
      </div>
  </section>
  <!-- End API Error Markup -->

  <div class="row">
      <button class="col-xs-3" v-for="tab in $parent.tabs" v-bind:key="tab"
          v-bind:class="['tab-button', {active: $parent.currentTab === tab }]"
          v-on:click="$parent.getSportsData( tab )">
          {{ tab }}
          <img :src="'./src/img/' + tab + '.png'" class="tab-image" />
      </button>
  </div>

  <!--  ==== v-bind:is tells us what component to use i.e. mlb-tab  
  Important. Must use kebab case for v-bind baseballData attribute
  because html is case insensitive and we used camelCase for
  variable names in component. <keep-alive> caches components once
  rendered. Here it works out good.
-->
  <keep-alive>
      <!-- === The Main Vue Web Component's ========= -->
      <component v-if="$parent.currentTabComponent === 'tab-mlb'" v-bind:is="$parent.currentTabComponent"
          v-bind:props_league_data="$parent.sports_feeds_data" v-bind:props_league_standings="$parent.standings"
          v-bind:props_baseball_playoffs="$parent.baseball_playoffs"
          v-bind:props_end_of_season="$parent.end_of_season[this.$parent.currentTab.toLowerCase()]"
          v-bind:props_box_game_scores_mlb="$parent.sports_feeds_boxscores_mlb" class="tab">
      </component>

      <component v-if="$parent.currentTabComponent === 'tab-nfl'" v-bind:is="$parent.currentTabComponent"
          v-bind:props_league_data_nfl="$parent.nfl_feeds" v-bind:props_league_standings="$parent.standings"
          v-bind:props_nfl_playoffs="$parent.nfl_playoffs"
          v-bind:props_end_of_season="$parent.end_of_season[this.$parent.currentTab.toLowerCase()]"
          v-bind:props_box_game_scores_nfl="$parent.sports_feeds_boxscores_nfl" class="tab">
      </component>

      <component v-if="$parent.currentTabComponent === 'tab-nba'" v-bind:is="$parent.currentTabComponent"
          v-bind:props_league_data="$parent.sports_feeds_data" v-bind:props_league_standings="$parent.standings"
          v-bind:props_basketball_playoffs="$parent.basketball_playoffs"
          v-bind:props_end_of_season="$parent.end_of_season[this.$parent.currentTab.toLowerCase()]"
          v-bind:props_box_game_scores_nba="$parent.sports_feeds_boxscores_nba" class="tab">
      </component>
  </keep-alive>

</div> <!-- End .container -->

<!-- === End The Main Web Component's ========= -->

`, // End of Template
   
});

module.exports =  Home;
