const fs = require("fs");
const copydir = require("copy-dir");
const { promisify } = require("util");

// Convert node fs methods w/callbacks to promises with .then
const access = promisify(fs.access);
const readFile = promisify(fs.readFile);
const copyFile = promisify(fs.copyFile);
const open = promisify(fs.open);
const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);
// End promise conversions

const mkdirp = require("mkdirp");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const imageminGifSicle = require("imagemin-gifsicle");

// ============= Using rimraf to clean up any existing build ============================== //
require("rimraf")("./dist", function() {
  // and then start rebuilding everything from scratch
  mkdirp("./dist/css", function(err) {
    if (err) {
      console.error(err);
    } else {
      /* jshint ignore:start */
      const uglifyJS = async function() {
        try {
          console.log("main.css: build and uglify");
          let uglified = require("uglifycss").processFiles(
            ["src/css/main.css"],
            {
              maxLineLen: 500,
              expandVars: true
            }
          );

          await writeFile("dist/css/main.css", uglified);
        } catch (err) {
          console.log("ERROR:", err);
        }
        return "======= Uglified CSS file(s) Successfully!!! ==============";
      }; // end uglifyJS async function
      /* jshint ignore:end */

      // ============ End rimraf ==================================================== //

      // ===========  Build the browserify bundle using the browserify api ========== //
      // First check if index.js exists
      /* jshint ignore:start */
      const browserifyJS = async function(result) {
        try {
          console.log(result); // output result from previous async function uglifyJS
          console.log("Checking for index.js");
          await open("index.js", "r");
          console.log("/dist/index.js: build and uglify");
          // Browserify API calls
          let b = require("browserify")();
          b.add("index.js");
          b.transform("uglifyify", { global: true });
          let indexjs = fs.createWriteStream("dist/index.js");
          // Bundle the files and their dependencies into a
          // single javascript file.
          b.bundle().pipe(indexjs);

          return "========== Browserify JavaScript Bundling Successful!!! ===============";
        } catch (err) {
          console.log("ERROR: " + err);
        }
      }; // End of browserifyJS
      /* jshint ignore:end */

      // ============== End Browserify Build ========================================//

      // ================== compressImages ========================================= //
      /* jshint ignore:start */
      const compressImages = async function(result) {
        console.log(result);
        fs.readdir("src/img", function(err, files) {
          if (err) {
            return `Alert! Check if the directory src/img exists. ${err}`;
          } else if (files.length === 0) {
            return "images: No images found.";
          } else {
            mkdirp("./dist/img", function(err) {
              if (err) {
                return err;
              } else {
                imagemin(["src/img/*.{jpg,png,gif,svg}"], "dist/img", {
                  plugins: [
                    imageminJpegtran(),
                    imageminPngquant({ quality: "65-80" }),
                    imageminGifSicle({ optimizationLevel: 2 })
                  ]
                });
              }
            });
          }
        });

        return "========== Images Compressed Successfully!!! ===============";
      }; // end async
      /* jshint ignore:end */
      // ========= End compressImages Function ==================== //

      // ============ Copy index.html to dist/index.html(copyIndexHtml) ============ //
      /* jshint ignore:start */
      const copyIndexFile = async function(result) {
        try {
          console.log(result);
          await access("./index.html", fs.constants.R_OK | fs.constants.W_OK);
          await copyFile("./index.html", "./dist/index.html");
        } catch (err) {
          console.log("ERROR:", err);
        }
        return "Copied Index.html to /dist!";
      }; // end copyIndexFile
      /* jshint ignore:end */

      // ================== End copyIndexFile ================ //

      // ====== getData (Read data from dist/index.html) =============== //

      /* jshint ignore:start */
      const getData = async function(result) {
        console.log(result);

        // Lets update dist/index.html file src and href links to reflect new location
        console.log(
          "index.html: Redoing file links to reflect move to /dist folder."
        );
        try {
          const fileContents = await readFile("dist/index.html", {
            encoding: "utf8"
          });

          // check and replace both src= and href= links to reflect chenge to dist/ folder
          // Notice we chained .replace to do it
          const regEx1 = /src\s*=\s*"\.\/src\//gi;
          const regEx2 = /src\s*=\s*'\.\/src\//gi;
          const regEx3 = /href\s*=\s*"\.\/src\//gi;
          const regEx4 = /href\s*=\s*'\.\/src\//gi;

          let distIndexHtml = fileContents
            .replace(regEx1, 'src="./')
            .replace(regEx2, "src='./")
            .replace(regEx3, 'href="./')
            .replace(regEx4, "href='./");

          // Write updated links to ./dist/index.html
          // console.log("distIndexHtml: " + distIndexHtml);
          await writeFile("dist/index.html", distIndexHtml, "utf8");

          // Confirm Write to index.html
          fs.stat("./dist/index.html", function(err, stats) {
            if (err) {
              console.log(`Error: ${err}`);
            } else if (stats.size === 0) {
              console.log(`Error copying index.html!!!!!!`);
            } else {
              console.log(
                `Successfully copied to dist\index.html. File size is ${
                  stats.size
                }`
              );
            }
          });
          return `======== Updated ./src and ./href links to show new /dist folder(getData). 
          Completed Successfully! ==========`;
        } catch (err) {
          return console.log("ERROR:", err);
        }
      };
      /* jshint ignore:end */

      // =================== End getData =============================== //

      //  ============= backgroundImgUrl =============================== //
      /* jshint ignore:start */
      const backgroundImgUrl = async function(result) {
        console.log(result);

        try {
          // Check dist\main.css and change the value to reflect move to dist directory
          console.log(
            "main.css: Redoing background-image property to reflect move to /dist folder."
          );

          // Grab contents of main.css, update and write back to disk
          const readCssFile = await readFile("dist/css/main.css", "utf8");
          // check and replace background-url property value in dist/main.css
          const regEx1 = /background-image\s*:\s*url\("\/src\//gi;
          const regEx2 = /background-image\s*:\s*url\('\/src\//gi;

          if (regEx1.test(readCssFile) || regEx2.test(readCssFile)) {
            let distMainCss = readCssFile
              .replace(regEx1, 'background-image:url("/')
              .replace(regEx2, "background-image:url('/");
            // console.log("distMainCss: " + distMainCss);

            // Write Updated Main.css back to disk
            await writeFile("dist/css/main.css", distMainCss, "utf8");
            return "Updated background-img URL CSS property Successfully!!! ";
          } else {
            return "Alert! No background-img property in CSS file";
          }
        } catch (err) {
          return console.log("ERROR:", err);
        }
      };

      /* jshint ignore:end */
      // ============ End backgroundImgUrl ==================================== //

      // ================= Update index.js src and href links ================= //
      /* jshint ignore:start */
      const updateIndexJS = async function(result) {
        console.log(result);
        try {
          // Check dist/index.js and change src and href values to reflect move to /dist directory
          console.log(
            "index.js: Redoing src and href links to reflect move to /dist folder."
          );

          // Grab contents of main.css, update and write back to disk
          const readIndexJSFile = await readFile("dist/index.js", "utf8");
          // check and replace href and src attribute values in dist/index.js
          // check and replace both src= and href= links to reflect chenge to dist/ folder
          // Notice we chained .replace to do it
          const regEx1 = /src\s*=\s*"\.\/src\//gi;
          const regEx2 = /src\s*=\s*'\.\/src\//gi;
          const regEx3 = /href\s*=\s*"\.\/src\//gi;
          const regEx4 = /href\s*=\s*'\.\/src\//gi;

          if (
            regEx1.test(readIndexJSFile) ||
            regEx2.test(readIndexJSFile) ||
            regEx3.test(readIndexJSFile) ||
            regEx4.test(readIndexJSFile)
          ) {
            let distIndexJSFile = readIndexJSFile
              .replace(regEx1, 'src="./')
              .replace(regEx2, "src='./")
              .replace(regEx3, 'href="./')
              .replace(regEx4, "href='./");

            // Write Updated Index.js back to disk
            await writeFile("dist/index.js", distIndexJSFile, "utf8");
            return "Updated dist/index.js src and href attribute values Successfully!!! ";
          } else {
            return "Alert! No src or href to change in index.js file";
          }
        } catch (err) {
          return console.log("ERROR:", err);
        }
      };
      /* jshint ignore:end */
      // ================= End Update index.js ================================ //

      // ================ Start MiscOperations =============================== //

      /* jshint ignore:start */
      const miscOperations = async function(result) {
        console.log(result);
        try {
          // Copy CNAME to /dist folder
          await access("CNAME", fs.constants.R_OK | fs.constants.W_OK);
          await copyFile("CNAME", "dist/CNAME");

          // Copy /src/resources to /dist folder
          const readDirectory = await readdir("./resources");

          if (readDirectory[0] === "foo.txt" && readDirectory.length === 1) {
            return `Alert! /resources only contains foo.txt. Directory not copied to /dist.
            ======== End miscOperations. =========`;
          } else if (readDirectory.length > 0) {
            console.log("/resources directory present. Copying to /dist...");
            copydir("resources", "dist/resources", err => {
              if (err) {
                throw console.log(err);
              }
            });
          } else if (!readDirectory.length) {
            return `Alert. /resources directory empty!!!
            ======== End miscOperations. =========`;
          } else {
            throw "Error reading /resources dierctory!";
          } // end if/else
          return `Copied /resources to /dist directory successfully!!!
           ====== End miscOperations. ======`;
        } catch (err) {
          return console.log("ERROR:", err);
        }
      }; // end miscOperations

      /* jshint ignore:end */

      // ==================================================== //
      // ========== Call promise chain ====================== //
      // ==================================================== //
      uglifyJS()
        .then(result => {
          return browserifyJS(result);
        })
        .then(
          result => {
            return compressImages(result);
          },
          err => {
            console.log(err);
            return compressImages(err);
          }
        )
        .then(result => {
          return copyIndexFile(result);
        })
        .then(result => {
          return getData(result);
        })
        .then(result => {
          return backgroundImgUrl(result);
        })
        .then(result => {
          return updateIndexJS(result);
        })
        .then(result => {
          return miscOperations(result);
        })
        .then(result => {
          console.log(result);
          console.log("Build Process Completed...");
        })
        .catch(function(error) {
          console.err(error);
        });
    } // mkdirp else end
  }); // mkdirp callback end
}); // rimraf callback end
