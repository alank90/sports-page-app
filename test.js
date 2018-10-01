// ====== Read data from dist/index.html(getData) =============== //

      /* jshint ignore:start */
      const getData = async function(result) {
        console.log(result);

        let distIndexHtml;
        // Lets update dist/index.html file src and href links to reflect new location
        console.log(
          "index.html: Redoing file links to reflect move to /dist folder."
        );
        fs.readFile("dist/index.html", "utf8", function(err, data) {
          if (err) {
            console.log(err);
          }

          // check and replace both src= and href= links to reflect chenge to dist/ folder
          // Notice we chained .replace to do it
          const regEx1 = /src\s*=\s*"\.\/src\//gi;
          const regEx2 = /src\s*=\s*'\.\/src\//gi;
          const regEx3 = /href\s*=\s*"\.\/src\//gi;
          const regEx4 = /href\s*=\s*'\.\/src\//gi;

          distIndexHtml = data
            .replace(regEx1, 'src="./')
            .replace(regEx2, "src='./")
            .replace(regEx3, 'href="./')
            .replace(regEx4, "href='./");

          fs.stat("./dist/index.html", function(err, stats) {
            if (err) {
              console.log(`Error: ${err}`);
            } else if (stats.size === 0) {
              console.log(`Error copying index.html!!!!!!`);
            } else {
              console.log(
                `Succesfully copied to dist\index.html. File size is ${
                  stats.size
                }`
              );
            }
          });
        }); // end fs.readfile index.html

        return distIndexHtml;
      }; //  End async function
      // ============ End getData function ================= //
      /* jshint ignore:end */