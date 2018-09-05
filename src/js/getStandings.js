const axios = require("axios");
let standings_data = {};

// Axios config object. Sent with get request
const config = {
  // `headers` are custom headers to be sent
  headers: {
    Authorization:
      "Basic NzAxMzNkMmEtNzVmMi00MjdiLWI5ZDYtOTgyZTFhOnNwb3J0c2ZlZWRzMjAxOA=="
  },
  // `params` are the URL parameters to be sent with the request
  // Must be a plain object or a URLSearchParams object. Set for each API call
  // below.
  params: {
    force: true
  }
};

axios
  .get(
    `https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/division_team_standings.json?teamstats=W,L,Win %,GB`,
    config
  )
  .then(response => {
    standings_data = response;
  })
  .catch(error => {
    console.log(error);
    this.errored = true;
  })
  .finally(() => standings_data);
// End ==== get.then ====== //
