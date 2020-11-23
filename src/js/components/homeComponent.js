// src/js/components/home.js

const Vue = require("vue");

const Home = {
  homeComponent: Vue.component("home", {
    template: `
    <div class="container">
      <!--======================== Navbar Markup ================================ -->
      <nav class="navbar navbar-expand-sm sticky-top navbar-dark bg-dark justify-content-between">
        <a class="navbar-brand" href="#">Sport's Scores</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item active">
              <router-link to="/" class="nav-link" href="#">Home <span class="sr-only">(current)</span></router-link>
            </li>

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                League Leaders
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <router-link to="/" class="dropdown-item" href="#">MLB League Leaders</router-link>
                <router-link to="/" class="dropdown-item" href="#">NFL League Leaders</router-link>
                <router-link to="/" class="dropdown-item" href="#">NBA League Leaders</router-link>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      <!-- ====================== End of Navbar Markup ============================== -->

      <h1 class="text-center inset-shadow">Scores From Around The Leagues</h1>
      <div id="sportsImages" class="title-images d-inline-flex justify-content-around fixed-top">
        <img src="./src/img/mlb-sm.jpg" alt="Pitcher Throwing Ball" />
        <img src="./src/img/nfl-sm.jpg" alt="David Tyree Superbowl Catch" />
        <img src="./src/img/nba-sm.jpg" alt="Michael Jordan Dunking" />
      </div>

      <hr class="my-2" />
      
    </div> <!-- End .container -->
    
    `, // end Template Literal
  }),
};

module.exports = {
  Home,
};
