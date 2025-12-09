// -----------------------------
// GLOBAL VARIABLES
// -----------------------------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Stay hungry, stay foolish.", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it's bad.", category: "Programming" },
  { text: "Success is not final; failure is not fatal.", category: "Motivation" }
];

// -----------------------------
// SAVE QUOTES TO LOCAL STORAGE
// -----------------------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// -----------------------------
// DISPLAY A RANDOM QUOTE
// -----------------------------
function showRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById("quoteDisplay").innerText = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  document.getElementById("quoteDisplay").innerText =
    `"${randomQuote.text}" — (${randomQuote.category})`;

  // Save last viewed quote
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// -----------------------------
// ADD NEW QUOTE
// -----------------------------
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added successfully!");
}

// -----------------------------
// POPULATE CATEGORY DROPDOWN
// -----------------------------
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  const selected = filter.value;

  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  filter.innerHTML = categories
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join("");

  // restore last selected category
  const lastCategory = localStorage.getItem("lastCategory");
  if (lastCategory) {
    filter.value = lastCategory;
  }
}

// -----------------------------
// FILTER QUOTES BY CATEGORY
// -----------------------------
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", selected);

  let filteredQuotes = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerText = "No quotes in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  document.getElementById("quoteDisplay").innerText =
    `"${randomQuote.text}" — (${randomQuote.category})`;
}

// -----------------------------
// EXPORT TO JSON FILE
// -----------------------------
function exportToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
}

// -----------------------------
// IMPORT FROM JSON FILE
// -----------------------------
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);

    saveQuotes();
    populateCategories();
    filterQuotes();

    alert("Quotes imported successfully!");
  };

  fileReader.readAsText(event.target.files[0]);
}

// -----------------------------
// INIT APP
// -----------------------------
window.onload = function () {
  populateCategories();

  // Restore last viewed quote
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const q = JSON.parse(last);
    document.getElementById("quoteDisplay").innerText =
      `"${q.text}" — (${q.category})`;
  } else {
    showRandomQuote();
  }

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
};

// Simulated server URL (JSONPlaceholder fake endpoint)
const serverURL = "https://jsonplaceholder.typicode.com/posts";

// Periodically sync every 15 seconds
setInterval(syncWithServer, 15000);

async function syncWithServer() {
  try {
    const response = await fetch(serverURL);
    const serverQuotes = await response.json();

    // Simulated conflict resolution:
    // Server data takes priority
    quotes = [
      ...serverQuotes.map(item => ({
        text: item.title,
        category: "Server"
      })),
      ...quotes
    ];

    saveQuotes();
    populateCategories();
    filterQuotes();

    console.log("Synced with server!");
  } catch (error) {
    console.error("Sync failed", error);
  }
}


