## What's in this project
This is a barebones Browserify and Budo project. The idea is the build all other projects using this as the basic setup.

This App calls out to https://www.mysportsfeeds.com/data-feeds/api-docs/ and retrieves gamescores
from the previous day.
### index.js
This will be used by budo to start up things.

You'll include all your JS libs here

Look at the `start` script in the `package.json`

### JS Libs:
#### Vue.js
We use Vue.js as our Javascript Front end framework along w/Bootstrap and jQuery for the scrollTop
effect.

### index.html
Has references to `main.css` and (**importantly**) `index.js`.

### main.css
Pretty obvious

### vue.js
Inside `src/js/` is where all the JS is. That's where we include Vue.js and associated Components. We also have the /modules directory for all modules.

## Important !!!
As of now around line 270 in Vue.js you have to change the line:

**startOfSeasonYear = 2018;**

every new Basketball season to build correct uri for /get to mysportsfeeds api. This needs to be refactored...

## Get going
1. Clone this repo
2. `cd` into the resultant dir
3. Run `npm install` to get the dependencies
4. Run `npm start` to launch the project in your default browser running on a local (`Node`-based) web server with `livereload` - all setup.

## Building the project for deployment
Well, this may be a rapo but we might still want to push this onto a prod environment. A apache server or something of the sort.

To generate a prod output, I've also created a `build.js` file that run's using:

*$ npm run build*

```
This creates a build dir that includes all you need to push to prod.
### Testing the build
If you want to check the build - Just to make sure:
```
*$ npm run testbuild*
```
This runs 'budo' on the build

## Using postcss-cli for css-declaration-sorter and autoprefixer

### Install postcss-cli globally:
`npm install -g postcss-cli`

And npx:
`npm install -g npx`

then install postcss plugins locally 

`npm install autoprefixer --save-dev`
`npm install css-declaration-sorter --save-dev`

### And then issue commands 
`npx postcss src\css\main.css -u css-declaration-sorter --replace --no-map`

`npx postcss src\css\main.css -u autoprefixer --replace`

Can also do postcss --h to see more options

### Note on Date() object
For good writeup on converting date to local time 
see https://www.techrepublic.com/article/convert-the-local-time-to-another-time-zone-with-this-javascript/

