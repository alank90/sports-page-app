/* eslint-disable no-unused-vars */
/* jshint esversion:5 */
/* jshint -W024 */

const Vue = require("vue");
const VueRouter = require("vue-router");
const home = require("../js/components/homeComponent");
const nfloffensiveleagueleaders = require("../js/components/nfl/nfloffensiveleagueleaders");
const nfldefensiveleagueleaders = require("../js/components/nfl/nfldefensiveleagueleaders");
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
    path: "/nfl/offensiveleaders",
    name: "nfloffensiveleagueleaders",
    component: nfloffensiveleagueleaders,
  },
  {
    path: "/nfl/defensiveleaders",
    name: "nfldefensiveleagueleaders",
    component: nfldefensiveleagueleaders,
  },
];

const router = new VueRouter({
  mode: "history",
  // eslint-disable-next-line no-undef
  base: process.env.BASE_URL,
  routes,
});

module.exports = router;
