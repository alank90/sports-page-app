## What's in this project

This is a barebones Browserify and Budo project. The idea is the build all other projects using this as the basic setup.

This App calls out to https://www.mysportsfeeds.com/data-feeds/api-docs/ and retrieves gamescores
from the previous day.

### index.js

This will be used by budo to start up things.

You'll include all your JS libs here

### Setting up budo server for SPA(vue-router)

Look at the `start` script entry in the `package.json`. Notice the **--pushstate** option. You can set a --pushstate flag to make the server capable for HTML5 pushState Single-Page Applications.

Now, any 404 requests (such as /foo/bar/blah or a browser refresh of a page) will get routed to the home _index.html_. This prevents getting a 404 error when refreshing a page in vue router.

### JS Libs:

#### Vue.js

We use Vue.js as our Javascript Front end framework along w/Bootstrap and jQuery for the scrollTop
effect.

### index.html

Has references to `main.css` and (**importantly**) `index.js`.

### main.css

Pretty obvious

### 200.html

When a request for a URL comes in where you don’t have a static HTML page, it will reach your 200 page instead, allowing you to use your client-side router. Necessary when deploying to surge.sh.

### vue.js

Inside `src/js/` is where all the JS is. That's where we include Vue.js and associated Components. We also have the /modules directory for all modules.

## Important(No Longer Necessary) !!!

As of now around line 270 in Vue.js you have to change the line:

**startOfSeasonYear = 2018;**

every new Basketball season to build the correct uri for /get to mysportsfeeds api. This needs to be refactored...

## Updating Sports Seasons for app

1. Goto **/src/js/modules/seasonDates.js**
2. There are objects for all the leagues, where you can update their start/end season dates which are used by our app to form the correct URI when requesting data. The NBA has an extra object for computing the season name because it spans over multiple years.

## Get going

1. Clone this repo
2. `cd` into the resultant dir
3. Run `npm install` to get the dependencies
4. Run `npm start` to launch the project in your default browser running on a local (_Node_-based) web server with _livereload - all_ setup.

## Building the project for deployment

Well, this may be a rapo but we might still want to push this onto a prod environment. An apache server or something of the sort.

To generate a prod output, I've also created a `build.js` file that run's using:

`$ npm run build`

This creates a build dir that includes all you need to push to prod.

## Testing the build

If you want to check the build - Just to make sure:

`$ npm run testbuild`

This runs _budo_ on the build

## Using postcss-cli for css-declaration-sorter and autoprefixer

### Install postcss-cli globally:

`npm i -D postcss postcss-cli`

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
