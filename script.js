// Get quote from API Server
// The API server we will use is
// https://forismatic.com/en/api/

// get key elements we want to manipulate
const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById('quote-content');
const quoteAuthor = document.getElementById('quote-author');
const tweetButton = document.getElementById("tweet-quote");
const newQuotebutton = document.getElementById("new-quote");
const loader = document.getElementById("loader");

const useProxy = false;
const proxyURL = "https://cors-everywhere.herokuapp.com/";

var quoteListArray = [];

// Load spinner
function loading() {
    quoteContainer.hidden = true;
    loader.hidden = false;
}

// Load quote container
function loadComplete() {
    if (quoteContainer.hidden) {
        loader.hidden = true;
        quoteContainer.hidden = false;
    }
}

// control quote generator constants
const longQuoteLimit = 120;

// initial load
async function initialLoader() {
    loading();

    // this is the third party quoting service
    // var apiURL = "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json";
    var apiURL = "quotes-en-1.json"

    if (useProxy) {
        apiURL = proxyURL + apiURL;
    }

    try {
        const response = await fetch(apiURL);
        const data = await response.text();

        parseQuoteData(data);
        let newQuote = getRandomQuote();
        refreshQuoteContent(newQuote);
        loadComplete();
    } catch (error) {
        console.log("Something bad happened and this load is doomed!", error)
    }
}

function parseQuoteData(quotes) {
    quoteList = quotes.split("\n");

    for(i = 0; i < quoteList.length; i++) {
        if (quoteList[i] !== "") {
            quoteJSON = JSON.parse(quoteList[i]);
            quoteListArray.push(quoteJSON);
        }
    }

    console.log(quoteListArray);
}

function refreshQuoteContent(quote) {
    // update empty authors with 'Unknown'
    if (quote.quoteAuthor === '') {
        quoteAuthor.innerText = "Unknown";
    } else {
        quoteAuthor.innerText = quote.quoteAuthor;
    }

    // append long-quote-content class
    // for long quotes
    if (quote.quoteText.length > longQuoteLimit) {
        quoteText.classList.add("long-quote-content");
    } else {
        quoteText.classList.remove("long-quote-content");
    }

    quoteText.innerText = quote.quoteText;
}


// get a random quote from array
function getRandomQuote() {
    var randomSeed = getRndInteger(0, quoteListArray.length - 1);

    return quoteListArray[randomSeed];
}

async function loadNewQuote() {
    loading();
    let waitNS = getRndInteger(1000, 2000);
    await new Promise(r => setTimeout(r, waitNS));
    newQuote = getRandomQuote();
    refreshQuoteContent(newQuote);
    loadComplete();
}

// tweet quote on Twitter button click
function tweetQuote() {
    const twitterURL = "https://twitter.com/intent/tweet";
    const quote = quoteText.innerText;
    const author = quoteAuthor.innerText;

    finalURL = `${twitterURL}?text=${quote} - ${author}`;

    window.open(finalURL, "_blank");
}

// generate a random number between min and max
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

// add event listeners to buttons
tweetButton.addEventListener("click", tweetQuote);
newQuotebutton.addEventListener("click", loadNewQuote);

// On page load
initialLoader()