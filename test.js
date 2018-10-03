// ================ Start MiscOperations =============================== //

      /* jshint ignore:start */
      const miscOperations = async function(result) {
        console.log(result);

        try {
          // Copy CNAME to /dist folder
          await checkFileAccess("CNAME", fs.constants.R_OK | fs.constants.W_OK);
          await fc("CNAME", "dist/CNAME");

          // Copy /src/resources to /dist folder
          fs.readdir("./resources", (err, files) => {
            if (err) {
              console.log("Error reading resources directory!");
            } else if (!files.length) {
              console.log("resources directory empty");
            } else {
              console.log("resources directory present. Copying to /dist.");
              copydir("resources", "dist/resources", err => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Copied /resources directory ok");
                }
              });
            }
          }); // end fs.readdir

          setTimeout(function() {
           console.log("Build Process Completed...");
          }, 1500);

          return "Test";
        } catch (err) {
          return console.log("ERROR:", err);
        }
      };
      /* jshint ignore:end */
      // ================= End MiscOperations ================================ //