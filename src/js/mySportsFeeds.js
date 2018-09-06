const axios = require("axios");
let data = {};

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
  feedsData: function(url) {
    url = encodeURI(url); // Format the URI

    axios
      .get(url, config)
      .then(function(response) {
        
        feedData = response.data.divisionteamstandings.division;
        console.log('data return' + feedData);
        return feedData;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
};
