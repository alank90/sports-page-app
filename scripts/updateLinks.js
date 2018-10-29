// /scripts/updateLinks.js
const fs = require("fs");
const { promisify } = require("util");
// Convert node fs methods w/callbacks to promises with .then
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
// End promise conversions

/* jshint ignore:start */
const updateLinks = async function(file) {
  // Lets update file src and href links to reflect new /dist location
  console.log(`${file}: Redoing file links to reflect move to /dist folder.`);
  try {
    if (file === "main.css") file = "css/main.css";
    const fileContents = await readFile(`dist/${file}`, {
      encoding: "utf8"
    });

    // check and replace both src= and href= links to reflect chenge to dist/ folder
    // Notice we chained .replace to do it
    const regEx1 = /src\s*=\s*"\.\/src\//gi;
    const regEx2 = /src\s*=\s*'\.\/src\//gi;
    const regEx3 = /href\s*=\s*"\.\/src\//gi;
    const regEx4 = /href\s*=\s*'\.\/src\//gi;
    const regEx5 = /".\/src\/img\/"/gi;

    let distFile = fileContents
      .replace(regEx1, 'src="./')
      .replace(regEx2, "src='./")
      .replace(regEx3, 'href="./')
      .replace(regEx4, "href='./")
      .replace(regEx5, '"./img/"');

    // Write updated links to ./dist/index.html
    await writeFile(`dist/${file}`, distFile, "utf8");

    // Confirm Write to index.html
    fs.stat(`dist/${file}`, function(err, stats) {
      if (err) {
        console.log(`Error: ${err}`);
      } else if (stats.size === 0) {
        console.log(`Error copying ${file}!!!!!!`);
      } else {
        console.log(
          `Successfully copied to dist\/${file}. File size is ${stats.size}`
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

module.exports = updateLinks;
