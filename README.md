# Spam & Toxic Text Detection

### Using Machine Learning to detect irrelevant and inappropriate text, entirely in the browser.

---

Try it out live in the browser 👉🏻 [(link)](https://francesconatali.com/personalprojects/ML/toxic-text-detection/)

---

#### What is toxic text? 🤬

Anything disrespectful, abusive, unpleasant, harmful, and/or simply irrelevant (SPAM). Detecting toxic text directly in the browser allows you to filter it out at the origin, even before it reaches your servers.

#### How does it work?

Once a sentence is submitted, the text is tokenized and passed to the model. The model then returns a toxicity level, ranging from 0 to 100. If it's greater than a given threshold, the text is considered toxic. In the example you'll find in this repository, the threshold is **75**. Anything equal or above is considered inappropriate and will be visually marked as toxic. In your code, you can change this value to your liking and to best fit your needs.

#### About the model

The model is trained using the [Model Maker's average word embedding algorithm](https://www.tensorflow.org/lite/models/modify/model_maker/text_classification), trained on a custom dataset of almost 2 thousands classified comments from Youtube and other sources. I trained the original Python model using Google Colab, then converted it in the TensorFlowJS format to be used in the browser. The entire model is just **199KB**, which makes it very lightweight.

#### Future improvements 🚀

Currently the model only supports **English**. It would be great to add support for other languages in the future. The only challenge is to find good datasets to train the model on. Also, at present, for maximum accuracy the model can validate no more than **20 words** at a time. This is not much of a limitation though, as you can simply split a long text into smaller chunks and validate each one. Although great care has been put into compiling a comprehensive training dataset, inevitably there might be some false positives and negatives. If you find any, please do let me know, or even better, submit a pull request on the CSV file `trainingdataset/toxictext_trainingdata.csv`.

#### How to use the model in your own projects

Simply copy the entire `model` folder in your project root directory. The folder includes these four files:

- dictionary.js
- model.js
- model.json
- shard.bin

In your `index.html`, within the HEAD section, add

```js
    <script
      src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js"
      type="text/javascript"
    ></script>
    <script type="module" src="./model/model.js"></script>
```

This will load TensorFlowJS and the JS file module to run the ML model. _(note the `type="module"` attribute)_

Almost done! All that is left to do is for you to call the `loadAndPredict` function with JS, passing the text to validate and get the **toxicityLevel** in return. Example:

```js
loadAndPredict(textToValidate).then(function (toxicityLevel) {
  if (toxicityLevel >= 75) {
    // Toxic text
  } else {
    // Non-toxic text
  }
});
```

_(for a complete working example, please refer to `js/script.js` in this repository)_

Well done, you're now running Machine Learning in your browser! 👏
