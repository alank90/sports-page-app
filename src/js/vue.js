//src/js/main.js
const Vue = require('vue');

const app = new Vue({
    el: '#app',
    data: {
      message: 'MLB Data Goes Here via Vue'
    }
  });
  
  module.exports = app;