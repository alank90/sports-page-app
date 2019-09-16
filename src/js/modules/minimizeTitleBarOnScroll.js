// /src/js/minimizeTitleBarOnScroll.js

let pageScrolled = false;

$(document).scroll(function() {
  if ($(document).scrollTop() > 250) {
    if (pageScrolled === false) {
      pageScrolled = true;
      $("#sportsImages")
        .stop()
        .animate({ opacity: 0.25, width: "50%", margin: "0, 25%" }, 1200);
    }
  } else {
    if (pageScrolled === true) {
      pageScrolled = false;
      $("#sportsImages")
        .stop()
        .animate({ opacity: 1, width: "100%", margin: "0" }, 1200);
    }
  }
});
