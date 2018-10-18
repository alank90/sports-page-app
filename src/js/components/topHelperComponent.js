// src/js/components/topHelperComponent.js

const Vue = require("vue");

const backToTop = {
  backToTopComponent: Vue.component("backtotop", {
    template: "#backtotop",
    data: function() {
      return {
        isVisible: false
      };
    },
    methods: {
      initToTopButton: function() {
        $(document).bind(
          "scroll",
          function() {
            var backToTopButton = $(".goTop");
            if ($(document).scrollTop() > 250) {
              backToTopButton.addClass("isVisible");
              this.isVisible = true;
            } else {
              backToTopButton.removeClass("isVisible");
              this.isVisible = false;
            }
          }.bind(this)
        );
      },
      backToTop: function() {
        $("html,body")
          .stop()
          .animate(
            {
              scrollTop: 0
            },
            "slow",
            "swing"
          );
      }
    },
    mounted: function() {
      this.$nextTick(function() {
        this.initToTopButton();
      });
    }
  })
};

module.exports = backToTop;
