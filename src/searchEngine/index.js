import data from "../data/data.json";


// object to store doc id as key and set of all words in the doc as value
let wordsInDoc = {};

let termFrequencyById = {};

// <word, count of docs>
let numOfDocsWithWord = {};

// idf of each word
let idfOfWord = {};

function computeWordFrequencyInDoc(id) {
  const summary = data.summaries.find((d) => d.id === id).summary;

  let words = [];

  // retrieve all words in a doc
  if (summary) {
    words = summary.split(" ");
  }

  // initialise an object to store word and frequency of the word in the doc as key value pair
  let wordFrequency = {};

  // loop thorugh each word and increment the frequency of each word in the map
  words.forEach((word) => {
    if (wordFrequency[word] === undefined) {
      numOfDocsWithWord[word] = numOfDocsWithWord[word]
        ? numOfDocsWithWord[word] + 1
        : 1;
    }

    wordFrequency[word] = wordFrequency[word] ? wordFrequency[word] + 1 : 1;
  });

  Object.keys(wordFrequency).forEach((word) => {
    wordFrequency[word] /= words.length;
  });

  // add frequency map to doc map
  termFrequencyById[id] = wordFrequency;

  // add the id of the doc and the list of words in the doc
  wordsInDoc[id] = Object.keys(wordFrequency);
}

function findInverseTermFrequency(word) {
  const totalDocuments = data.summaries.length;

  Object.keys(numOfDocsWithWord).forEach((word) => {
    idfOfWord[word] = numOfDocsWithWord[word]
      ? Math.log10(totalDocuments / numOfDocsWithWord[word])
      : 0;
  });
}

function findRelevance(word, id) {
  return (termFrequencyById[id][word] ? termFrequencyById[id][word] : 0) *
    idfOfWord[word]
    ? idfOfWord[word]
    : 0;
}

data.summaries.forEach(({ id, summary }) => computeWordFrequencyInDoc(id));

findInverseTermFrequency();

function getQueryrelevance(query) {
  const words = query.split(" ");

  let frequency = {};

  words.forEach((word) => {
    frequency[word] = frequency[word] ? frequency[word] + 1 : 1;
  });

  let relevance = {};

  Object.keys(frequency).forEach((word) => {
    frequency[word] /= words.length;

    relevance[word] = idfOfWord[word] ? idfOfWord[word] * frequency[word] : 0;
  });

  return relevance;
}

function calculateCosineSimilarity(query, doc) {
  const queryRelevance = getQueryrelevance(query);

  let numerator = 0;
  let denominatorQuery = 0;
  let denominatorDocument = 0;

  Object.keys(queryRelevance).forEach((word) => {
    numerator += queryRelevance[word] * findRelevance(word, doc);

    denominatorQuery += queryRelevance[word] * queryRelevance[word];

    denominatorDocument += findRelevance(word, doc) * findRelevance(word, doc);
  });

  denominatorQuery = Math.sqrt(denominatorQuery);
  denominatorDocument = Math.sqrt(denominatorDocument);

  if (denominatorDocument === 0) {
    return 0;
  }
  return numerator / (denominatorQuery * denominatorDocument);
}

export default function (query, maxSuggestions) {
  let relevance = [];
  data.summaries.forEach(({ id, summary }) => {
    const similarity = calculateCosineSimilarity(query, id);

    relevance.push({ id: id, relevance: similarity });
  });

  const suggestions = relevance
    .sort((a, b) => {
      return b.relevance - a.relevance;
    })
    .slice(0, maxSuggestions)
    .map((item) => {
      const title = data.titles[item.id];
      const author = data.authors.find((d) => d.book_id === item.id).author;
      const summary = data.summaries.find((d) => d.id === item.id).summary;

      return {
        title,
        author,
        summary,
      };
    });

  return suggestions;
}
