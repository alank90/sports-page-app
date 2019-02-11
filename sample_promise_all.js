// Taken from https://developers.google.com/web/fundamentals/primers/promises
/* Complex async code made easier

    Right, let's code some things. Say we want to:

        1 Start a spinner to indicate loading
        2 Fetch some JSON for a story, which gives us the title, and urls for each chapter
        3 Add title to the page
        4 Fetch each chapter
        5 Add the story to the page
        6 Stop the spinner
 */

getJSON('story.json').then(function(story) {
    addHtmlToPage(story.heading);
  
    // Map our array of chapter urls to
    // an array of chapter json promises.
    // This makes sure they all download in parallel.
    return story.chapterUrls.map(getJSON)
      .reduce(function(sequence, chapterPromise) {
        // Use reduce to chain the promises together,
        // adding content to the page for each chapter
        return sequence.then(function() {
          // Wait for everything in the sequence so far,
          // then wait for this chapter to arrive.
          return chapterPromise;
        }).then(function(chapter) {
          addHtmlToPage(chapter.html);
        });
      }, Promise.resolve());
  }).then(function() {
    addTextToPage("All done");
  }).catch(function(err) {
    // catch any error that happened along the way
    addTextToPage("Argh, broken: " + err.message);
  }).then(function() {
    document.querySelector('.spinner').style.display = 'none';
  });
  