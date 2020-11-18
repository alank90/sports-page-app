// ---------- src/js/modules/ ------------------ //

/* jshint ignore:start */
// Make function to retrieve League Leaders in a Category
try {
  const getLeagueLeaders = async (url, params) => {
    fetch(url + new URLSearchParams(params), {
      method: "get",
      headers: {
        Authorization:
          "Basic NzAxMzNkMmEtNzVmMi00MjdiLWI5ZDYtOTgyZTFhOnNwb3J0c2ZlZWRzMjAxOA==",
      },
    })
      .then((response) => response.json())
      .then((data) => data);
  };

  module.exports = getLeagueLeaders;
} catch (err) {
  console.log(err);
}
