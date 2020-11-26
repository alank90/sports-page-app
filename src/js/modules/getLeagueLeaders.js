// ---------- src/js/modules/ ------------------ //

/* jshint ignore:start */
// Make function to retrieve League Leaders in a Category

const getLeagueLeaders = (url, params) => {
  // First let's create the array of url's
  let queryURLs = [];

  params.forEach((param) => {
    queryURLs.push(`fetch(${url}${new URLSearchParams(param)}, {
      method: "get",
      headers: {
        Authorization:
          "Basic NzAxMzNkMmEtNzVmMi00MjdiLWI5ZDYtOTgyZTFhOnNwb3J0c2ZlZWRzMjAxOA==",
      }
    })`);
  });
  console.log("Query params array is %s", queryURLs[1]);

  return fetch(url + new URLSearchParams(params[0]), {
    method: "get",
    headers: {
      Authorization:
        "Basic NzAxMzNkMmEtNzVmMi00MjdiLWI5ZDYtOTgyZTFhOnNwb3J0c2ZlZWRzMjAxOA==",
    },
  }).then((response) => response.json());
};

module.exports = getLeagueLeaders;
