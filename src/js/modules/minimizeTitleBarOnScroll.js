// /src/js/minimizeTitleBarOnScroll.js

$(document).on("scroll", function() {
  if ($(document).scrollTop() > 250) {
    $(".title-images").animate(
      {
        opacity: 0.25
      },
      2000,
      function() {
        console.log("Animation Complete");
      }
    );
  } else if ($(document).scrollTop() < 250) {
    $(".title-images")
      .stop()
      .animate(
        {
          opacity: 0.98
        },
        "slow",
        "swing"
      );
  }
});
