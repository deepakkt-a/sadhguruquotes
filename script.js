// Get quote from API Server
// The API server we will use is
// https://forismatic.com/en/api/

// get key elements we want to manipulate
const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById('quote-content');
const quoteAuthor = document.getElementById('quote-author');
const tweetButton = document.getElementById("tweet-quote");
const newQuotebutton = document.getElementById("new-quote");
const loader = document.getElementById("loader")

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

// actual get quote function
async function getQuote() {
    loading();

    const proxyURL = "https://cors-everywhere.herokuapp.com/";
    const apiURL = proxyURL + "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json";

    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        refreshQuoteContent(data);
        loadComplete();
    } catch (error) {
        getQuote();
    }
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

// tweet quote on Twitter button click
function tweetQuote() {
    const twitterURL = "https://twitter.com/intent/tweet";
    const quote = quoteText.innerText;
    const author = quoteAuthor.innerText;

    finalURL = `${twitterURL}?text=${quote} - ${author}`;

    window.open(finalURL, "_blank");
}

// add event listeners to buttons
tweetButton.addEventListener("click", tweetQuote);
newQuotebutton.addEventListener("click", getQuote);

// On page load
getQuote()