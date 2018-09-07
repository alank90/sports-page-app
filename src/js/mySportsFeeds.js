const axios = require("axios");

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

module.exports = {
  /* jshint ignore:start */
  feedsData: async function(url) {
    url = encodeURI(url); // Format the URI
    
    return (await axios.get(url, config)).data.divisionteamstandings.division;
  }
  /* jshint ignore:end */
};
