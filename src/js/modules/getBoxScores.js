// --------- src/modules/getBoxScores.js --------------- //
const axios = require("axios");

let boxScores = [];
let promises = [];

/* jshint ignore:start */
// Make function async that way it will return a promise that the await invocation can consume
try {
  const getBoxScores = async (gameIDs, myUrl, params) => {
    gameIDs.forEach(function(item) {
      promises.push(
        axios({
          method: "get",
          headers: {
            Authorization:
              "Basic NzAxMzNkMmEtNzVmMi00MjdiLWI5ZDYtOTgyZTFhOnNwb3J0c2ZlZWRzMjAxOA=="
          },
          url: myUrl + item,
          params: params
        })
      );
    });

    // axios.all returns a single Promise that resolves when all of the promises passed
    // as an iterable have resolved. This single promise, when resolved, is passed to the
    // "then" and into the "values" parameter.
    await axios.all(promises).then(function(values) {
      boxScores = values;
    });

    return boxScores;
  };

  module.exports = getBoxScores;
} catch (err) {
  console.log(err);
}
/* jshint ignore:end */
