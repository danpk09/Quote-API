const fetchAllButton = document.getElementById("fetch-quotes");
const fetchRandomButton = document.getElementById("fetch-random");
const fetchByAuthorButton = document.getElementById("fetch-by-author");

const quoteContainer = document.getElementById("quote-container");
const quoteText = document.querySelector(".quote");
const attributionText = document.querySelector(".attribution");

const resetQuotes = () => {
  quoteContainer.innerHTML = "";
};

const renderError = (response) => {
  quoteContainer.innerHTML = `<p>Your request returned an error from the server: </p>
<p>Code: ${response.status}</p>
<p>${response.statusText}</p>`;
};

const renderQuotes = (quotes = []) => {
  resetQuotes();
  if (quotes.length > 0) {
    quotes.forEach((quote) => {
      const newQuote = document.createElement("div");
      newQuote.className = "single-quote";
      newQuote.innerHTML = `<div class="quote-text">${quote.quote}</div>
      <div class="attribution">- ${quote.person}</div>
      <button class="delete-button" data-id="${quote.id}">Delete</button>`;
      quoteContainer.appendChild(newQuote);
    });
    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const quoteId = event.target.getAttribute("data-id");
        fetch(`/api/quotes/${quoteId}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              button.parentNode.remove();
              const successMessage = document.createElement("p");
              successMessage.innerText = "Your quote has been deleted!";
              quoteContainer.appendChild(successMessage);
            } else {
              renderError(response);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
    });
  } else {
    quoteContainer.innerHTML = "<p>Your request returned no quotes.</p>";
  }
};

fetchAllButton.addEventListener("click", () => {
  fetch("/api/quotes")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
    .then((response) => {
      renderQuotes(response.quotes);
    });
});

fetchRandomButton.addEventListener("click", () => {
  fetch("/api/quotes/random")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
    .then((response) => {
      renderQuotes([response.quote]);
    });
});

fetchByAuthorButton.addEventListener("click", () => {
  const author = document.getElementById("author").value;
  fetch(`/api/quotes?person=${author}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
    .then((response) => {
      renderQuotes(response.quotes);
    });
});
