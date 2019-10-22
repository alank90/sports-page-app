const Vue = require("vue");
const axios = require("axios");

const { EventBus } = require("../../modules/event-bus");

const qbCumulativeStats = {
  props: [],
  data: function() {
    return {
      showComponent: false,
      loading: false
    };
  }
};
