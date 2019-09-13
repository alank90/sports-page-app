// /src/js/minimizeTitleBarOnScroll.js

$(document).on("scroll", function() {
  console.log($(document).scrollTop());
  if ($(document).scrollTop() > 250) {
    $("#sportsImages").animate(
      {
        opacity: 0.25
      },
      2000
    );
  } else {
    if ($(document).scrollTop() < 250) {
      $("#sportsImages").animate(
        {
          opacity: 0.99
        },
        2000
      );
    }
    console.log("Animation Complete");
  }
});
