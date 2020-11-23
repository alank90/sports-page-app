/* eslint-disable no-unused-vars */
/* jshint esversion:5 */
/* jshint -W024 */

const Vue = require("vue");
const VueRouter = require("vue-router");
const Home = require("../js/components/homeComponent");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
];

const router = new VueRouter({
  mode: "history",
  // eslint-disable-next-line no-undef
  base: process.env.BASE_URL,
  routes,
});

module.exports = router;
