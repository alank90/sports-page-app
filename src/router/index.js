/* eslint-disable no-unused-vars */
/* jshint esversion:5 */
/* jshint -W024 */

const Vue = require("vue");
const VueRouter = require("vue-router");
//const home = require("../js/components/homeComponent");

Vue.use(VueRouter);
const home = {
  template: `
<div class="container">
  
  <h1 class="text-center inset-shadow">Scores From Around The Leagues</h1>
  <div id="sportsImages" class="title-images d-inline-flex justify-content-around fixed-top">
    <img src="./src/img/mlb-sm.jpg" alt="Pitcher Throwing Ball" />
    <img src="./src/img/nfl-sm.jpg" alt="David Tyree Superbowl Catch" />
    <img src="./src/img/nba-sm.jpg" alt="Michael Jordan Dunking" />
  </div>

  <hr class="my-2" />
        
</div> <!-- End .container -->
`,
};

const routes = [
  {
    path: "/",
    name: "Home",
    component: home,
  },
];

const router = new VueRouter({
  mode: "history",
  // eslint-disable-next-line no-undef
  base: process.env.BASE_URL,
  routes,
});

module.exports = router;
