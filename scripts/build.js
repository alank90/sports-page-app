const fs = require("fs");
const copydir = require("copy-dir");
const { promisify } = require("util");
const updateLinks = require("./updateLinks");
const checkMark = "\u2714";
const warning = "\u2757";

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
require("rimraf")("./dist", function () {
  // and then start rebuilding everything from scratch
  mkdirp("./dist/css", function (err) {
    if (err) {
      console.error(err);
    } else {
      /* jshint ignore:start */
      const uglifyJS = async function () {
        try {
          const readDirectory = await readdir("./src/css");

          if (readDirectory[0] === "main.css" && readDirectory.length === 1) {
            console.log("main.css: build and uglify");
            let uglified = require("uglifycss").processFiles(
              ["src/css/main.css"],
              {
                maxLineLen: 500,
                expandVars: true,
              }
            );

            await writeFile("dist/css/main.css", uglified);

            return `Alert! ./src/css/main.css copied to /dist/css. ${checkMark}
                    ======== End =========`;

            // Copy /src/css to /dist/css folder
          } else if (readDirectory.length > 0) {
            console.log("/src/css directory present. Copying to /dist/css...");
            let uglifiedcss = require("uglifycss");

            readDirectory.forEach(async (cssFile) => {
              console.log(`${cssFile}: build and uglify`);
              uglified = uglifiedcss.processFiles([`src/css/${cssFile}`], {
                maxLineLen: 500,
                expandVars: true,
              });

              await writeFile(`dist/css/${cssFile}`, uglified);
            });

            return `Uglified and copied CSS file(s) Successfully!!! ======= ${checkMark}`;
          } else if (!readDirectory.length) {
            return `Alert. /css directory empty ${warning}
             ====== End CSS Uglify. No files to uglify. =====`;
          } // end if/else
        } catch (err) {
          console.log("ERROR:", err);
        }
      }; // end uglifyJS async function
      /* jshint ignore:end */

      // ============ End rimraf ==================================================== //

      // ===========  Build the browserify bundle using the browserify api ========== //
      // First check if index.js exists
      /* jshint ignore:start */
      const browserifyJS = async function (result) {
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

          return `==== Browserify JavaScript Bundling Successful ===== ${checkMark}`;
        } catch (err) {
          console.log("ERROR: " + err);
        }
      }; // End of browserifyJS
      /* jshint ignore:end */

      // ============== End Browserify Build ========================================//

      // ================== compressImages ========================================= //
      /* jshint ignore:start */
      const compressImages = async function (result) {
        console.log(result);
        fs.readdir("src/img", function (err, files) {
          if (err) {
            return `Alert! Check if the directory src/img exists. ${err}`;
          } else if (files.length === 0) {
            return `images: No images found. ${warning}`;
          } else {
            mkdirp("./dist/img", function (err) {
              if (err) {
                return err;
              } else {
                imagemin(["src/img/*.{jpg,png,gif,svg}"], "dist/img", {
                  plugins: [
                    imageminJpegtran(),
                    imageminPngquant({ quality: "65-80" }),
                    imageminGifSicle({ optimizationLevel: 2 }),
                  ],
                });
              }
            });
          }
        });

        return `==== Images Compressed Successfully === ${checkMark}`;
      }; // end async
      /* jshint ignore:end */
      // ========= End compressImages Function ==================== //

      // ============ Copy index.html to dist/index.html(copyIndexHtml) ============ //
      /* jshint ignore:start */
      const copyIndexFile = async function (result) {
        try {
          console.log(result);
          await access("./index.html", fs.constants.R_OK | fs.constants.W_OK);
          await copyFile("./index.html", "./dist/index.html");
        } catch (err) {
          console.log("ERROR:", `err ${warning}`);
        }
        return `Copied Index.html to /dist! ${checkMark}`;
      }; // end copyIndexFile
      /* jshint ignore:end */

      // ================== End copyIndexFile ================ //

      //  ============= backgroundImgUrl =============================== //
      /* jshint ignore:start */
      const backgroundImgUrl = async function (result) {
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

            // Write Updated Main.css back to disk
            await writeFile("dist/css/main.css", distMainCss, "utf8");
            return `Updated background-img URL CSS property Successfully ${checkMark}`;
          } else {
            return `Alert! No background-img property in CSS file ${warning}`;
          }
        } catch (err) {
          return console.log("ERROR:", `err ${warning}`);
        }
      };

      /* jshint ignore:end */
      // ============ End backgroundImgUrl ==================================== //

      // ================ Start MiscOperations =============================== //

      /* jshint ignore:start */
      const miscOperations = async function (result) {
        console.log(result);
        try {
          // Copy CNAME,favicon.jpg, and 200.html to /dist folder
          await copyFile("CNAME", "./dist/CNAME")
            .then(() =>
              console.log(`CNAME copied successfully to /dist! ${checkMark}`)
            )
            .catch(() => console.log(`No CNAME file to copy. ${warning}`));

          await copyFile("favicon.jpg", "./dist/favicon.jpg")
            .then(() =>
              console.log(
                `favicon.jpg successfully copied to /dist! ${checkMark}`
              )
            )
            .catch(() =>
              console.log(`No favicon.jpg file to copy. ${warning}`)
            );

          await copyFile("200.html", "./dist/200.html")
            .then(() =>
              console.log(`200.html copied successfully to /dist! ${checkMark}`)
            )
            .catch(() => console.log(`No 200.html file to copy. ${warning}`));

          // Copy /src/resources to /dist folder
          const readDirectory = await readdir("./resources");

          if (readDirectory[0] === "foo.txt" && readDirectory.length === 1) {
            return `Alert! /resources only contains foo.txt. Directory not copied to /dist. ${warning}
            ======== End miscOperations. =========`;
          } else if (readDirectory.length > 0) {
            console.log("/resources directory present. Copying to /dist...");
            copydir("resources", "dist/resources", (err) => {
              if (err) {
                throw console.log(`err ${warning}`);
              }
            });
            return `Copied /resources to /dist directory successfully ${checkMark}
           ====== End miscOperations. ======`;
          } else if (!readDirectory.length) {
            return `Alert. /resources directory empty ${warning}
            ====== End miscOperations. =====`;
          } // end if/else
        } catch (err) {
          return console.log("ERROR:", `err ${warning}`);
        }
      }; // ============== end miscOperations =========================== //

      // ====== updateFileLinks (Read and update links from dist/index.html, main.css,
      // and index.js if necessary) ============ //
      /* jshint ignore:start */
      const UpdateFileLinks = async function () {
        try {
          await updateLinks("index.html");
          await updateLinks("main.css");
          await updateLinks("index.js");
        } catch (err) {
          console.log("ERROR:", `err ${warning}`);
        }
      };

      /* jshint ignore:end */
      // =================== End updateLinks =============================== //

      // ==================================================== //
      // ========== Call promise chain ====================== //
      // ==================================================== //
      uglifyJS()
        .then((result) => {
          return browserifyJS(result);
        })
        .then(
          (result) => {
            return compressImages(result);
          },
          (err) => {
            console.log(err);
            return compressImages(err);
          }
        )
        .then((result) => {
          return copyIndexFile(result);
        })
        .then((result) => {
          return backgroundImgUrl(result);
        })
        .then((result) => {
          return miscOperations(result);
        })
        .then((result) => {
          console.log(result);
          console.log(`Pause for index.js to bundle and finish \u270B`);
          setTimeout(() => {
            // I know this is a kludge!!
            return UpdateFileLinks();
          }, 7000);
        })
        .catch(function (error) {
          console.err(error);
        });
    } // mkdirp else end
  }); // mkdirp callback end
}); // rimraf callback end
