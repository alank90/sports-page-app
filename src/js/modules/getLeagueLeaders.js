// ---------- src/js/modules/ ------------------ //

/* jshint ignore:start */
// Make function to retrieve League Leaders in a Category

const getLeagueLeaders = (url, params) => {
  // First let's create the array of url's
  let queryURLs = [];

  params.forEach((param) => {
    queryURLs.push(
      fetch(`${url}${new URLSearchParams(param)}`, {
        method: "get",
        headers: {
          Authorization:
            "Basic OWU3OTk3NGYtOGM1NS00YjVlLWIyODgtMTU0MWM0OnNwb3J0c2ZlZWRzMjAxOA====",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then((res) => res.json())
    );
  });

  // Return array of fetch() Promises to be fulfilled
  return Promise.all(queryURLs).catch((err) => {
    console.error("There was problem retrieving data.", err);
  });
};

module.exports = getLeagueLeaders;
