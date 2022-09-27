/* 
  Application logic to handle the processing of submitted text.
*/
const POST_COMMENT_BTN = document.getElementById('post');
const COMMENT_TEXT = document.getElementById('comment');
const COMMENTS_LIST = document.getElementById('commentsList');
// CSS styling class to indicate comment is being processed when
// posting to provide visual feedback to users.
const PROCESSING_CLASS = 'processing';
// CSS styling class to indicate comment is toxic.
const TOXIC_CLASS = 'toxic';
// Anything equal or above is considered toxic.
const TOXIC_THRESHOLD = 75;

POST_COMMENT_BTN.addEventListener('click', handleCommentPost);

/*
  Function to handle the processing of submitted text.
*/
function handleCommentPost() {
  // Only continue if there's no other ongoing processing.
  if (! POST_COMMENT_BTN.classList.contains(PROCESSING_CLASS)) {
    // Get the text to validate.
    let currentComment = COMMENT_TEXT.innerText.trim();
    // Double-check there's something to validate
    if (currentComment.length === 0) {
      // Reset the comment text box.
      COMMENT_TEXT.innerText = '';
      // Focus back to the comment text box.
      COMMENT_TEXT.focus();
    } else {
      // Visually mark the comment as being processed.
      POST_COMMENT_BTN.classList.add(PROCESSING_CLASS);
      COMMENT_TEXT.classList.add(PROCESSING_CLASS);
     
      // Create a list item DOM element in memory.
      let div = document.createElement('div');
      div.classList.add('relative', 'col-span-full', 'rounded-2xl', 'overflow-hidden', 'border', 'border-gray-80', 'border-opacity-20', 'shadow-2xl', 'mt-8', 'p-4', 'md:text-2xl', 'text-gray-80');
      let p = document.createElement('p');
      p.innerText = currentComment.split(' ').slice(0, 20).join(' ');

      div.appendChild(p);
      COMMENTS_LIST.prepend(div);

      // Reset comment text.
      COMMENT_TEXT.innerText = '';
      
      // loadAndPredict (see model.js) is asynchronous so I use the then 
      // keyword to await a result before continuing.
      loadAndPredict(currentComment).then(function(toxicityLevel) {
        // Reset class styles ready for the next comment.
        POST_COMMENT_BTN.classList.remove(PROCESSING_CLASS);
        COMMENT_TEXT.classList.remove(PROCESSING_CLASS);
        // Act on the result
        if (toxicityLevel >= TOXIC_THRESHOLD) {
          // Visually mark the text as toxic.
          div.classList.add(TOXIC_CLASS);
        } else {
          // Non-toxic text, nothing to do.
        }
      });
    }
  }
}