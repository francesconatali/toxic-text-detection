/* 
  This file contains the code for the Machine Learning model.

  Note: this file has to be loaded using the type="module" attribute,
  eg. <script type="module" src="..."></script>
*/
import * as DICTIONARY from './dictionary.js';
const MODEL_JSON_URL = './model/model.json';
// The number of input elements the ML Model is expecting,
// 21 because we have 20 words plus the START token.
const ENCODING_LENGTH = 21;

var model = undefined;

// As JavaScript modules by default don't interact with non module script files
// I need to export the loadAndPredict function so that it can be called from outside (file script.js)
window.loadAndPredict = async function loadAndPredict(inputText) {
  // Load the model.json and binary files. Note this is 
  // an asynchronous operation so I use the await keyword
  if (model === undefined) {
    model = await tf.loadLayersModel(MODEL_JSON_URL);
  }
  
  // Convert sentence to lower case which ML Model expects
  // Strip all characters that are not alphanumeric or spaces
  // Then split on spaces to create a word array.
  let lowercaseSentenceArray = inputText.toLowerCase().replace(/[^\w\s]/g, ' ').split(' ');
  
  // First 20 words only
  lowercaseSentenceArray = lowercaseSentenceArray.slice(0, 20);
  
  // Once model has loaded, I can now call model.predict and pass to it
  // an input in the form of a Tensor and then store the result.
  let results = model.predict(tokenize(lowercaseSentenceArray));
  
  // Print the result to the console for inspection.
  // results.print();

  // Extract the values from the Tensor and store in a JavaScript array.
  let dataArray = results.dataSync();

  // dataArray[1] contains the probability of the text being toxic
  // and it can be converted to a percentage by multiplying by 100
  // to make it easier to read and handle.
  let toxicityLevel = dataArray[1] * 100;

  // Print the Toxiticy level for inspection.
  console.log('Toxiticy level: ' + toxicityLevel);

  return toxicityLevel;
}

/** 
 * Function that takes an array of words, converts words to tokens,
 * and then returns a Tensor representation of the tokenization that
 * can be used as input to the machine learning model.
 */
function tokenize(wordArray) {
  // Always start with the START token.
  let returnArray = [DICTIONARY.START];
  
  // Loop through the words in the sentence you want to encode.
  // If word is found in dictionary, add that number else
  // you add the UNKNOWN token.
  for (var i = 0; i < wordArray.length; i++) {
    let encoding = DICTIONARY.LOOKUP[wordArray[i]];
    returnArray.push(encoding === undefined ? DICTIONARY.UNKNOWN : encoding);
  }
  
  // Finally if the number of words was < the minimum encoding length
  // fill the rest with PAD tokens.
  while (returnArray.length < ENCODING_LENGTH) {
    returnArray.push(DICTIONARY.PAD);
  }
  
  // Log the result for inspection.
  // console.log([returnArray]);
  
  // Convert to a TensorFlow Tensor 2D and return that.
  return tf.tensor2d([returnArray]);
}