/* eslint-disable no-unused-vars */
/* jshint esversion:5 */
/* jshint -W024 */

const Vue = require("vue");
const VueRouter = require("vue-router");
const home = require("../js/components/homeComponent");
const nflLeagueLeaders = require("../js/components/nfl/nflLeagueLeaders");
const mlbLeagueLeaders = require("../js/components/nfl/mlbleagueleaders");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: home,
  },
  {
    path: "/mlbleagueleaders",
    name: "mlbleagueleaders",
    component: mlbLeagueLeaders,
  },
  {
    path: "/nflleagueleaders",
    name: "nflLeagueLeaders",
    component: nflLeagueLeaders,
  }
];

const router = new VueRouter({
  mode: "history",
  // eslint-disable-next-line no-undef
  base: process.env.BASE_URL,
  routes,
});

module.exports = router;
