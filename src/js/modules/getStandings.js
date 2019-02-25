// ====================================================================== //
//====== Get Standings From MySportsFeeds Site ========================== //
// ===================================================================== //

const mySportsFeeds = require("./mySportsFeeds");

/* jshint ignore:start */
module.exports = async (url) => {
  standings = await mySportsFeeds.feedsData(url);
  return standings;
};
/* jshint ignore:end */
