// -----------------------------
// INITIAL QUOTES + STORAGE LOAD
// -----------------------------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Stay hungry, stay foolish.", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it's bad.", category: "Programming" },
  { text: "Success is not final; failure is not fatal.", category: "Motivation" }
];

// Save quotes to storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// -----------------------------
// SHOW RANDOM QUOTE
// -----------------------------
function showRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById("quoteDisplay").innerText = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selectedQuote = quotes[randomIndex];

  document.getElementById("quoteDisplay").innerText =
    `"${selectedQuote.text}" — (${selectedQuote.category})`;

  // Save last viewed quote to sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(selectedQuote));
}

// -----------------------------
// CREATE ADD QUOTE FORM (DOM CREATION)
// -----------------------------
function createAddQuoteForm() {
  const container = document.getElementById("quoteFormContainer");
  container.innerHTML = ""; // Clear if called again

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const button = document.createElement("button");
  button.innerText = "Add Quote";
  button.onclick = addQuote;

  container.appendChild(textInput);
  container.appendChild(categoryInput);
  container.appendChild(button);
}

// -----------------------------
// ADD A NEW QUOTE
// -----------------------------
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  // Add into array
  quotes.push({ text, category });

  // Save to storage
  saveQuotes();

  // Update category dropdown
  populateCategories();

  // Update displayed quote
  filterQuotes();

  // Clear fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
}

// -----------------------------
// POPULATE CATEGORY FILTER
// -----------------------------
function populateCategories() {
  const filterDropdown = document.getElementById("categoryFilter");

  // Generate unique category list
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  filterDropdown.innerHTML = categories
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join("");

  // Restore last selected category
  const last = localStorage.getItem("lastCategory");
  if (last) filterDropdown.value = last;
}

// -----------------------------
// FILTER QUOTES BY CATEGORY
// -----------------------------
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;

  // Save selected filter
  localStorage.setItem("lastCategory", selected);

  let filteredQuotes =
    selected === "all"
      ? quotes
      : quotes.filter(q => q.category === selected);

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerText =
      "No quotes in this category.";
    return;
  }

  // Show a random quote from selected category
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const q = filteredQuotes[randomIndex];

  document.getElementById("quoteDisplay").innerText =
    `"${q.text}" — (${q.category})`;
}

// -----------------------------
// EXPORT QUOTES TO JSON FILE
// -----------------------------
function exportToJson() {
  const jsonStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
}

// -----------------------------
// IMPORT QUOTES FROM JSON FILE
// -----------------------------
function importFromJsonFile(event) {
  const reader = new FileReader();

  reader.onload = function (e) {
    const imported = JSON.parse(e.target.result);

    quotes.push(...imported);
    saveQuotes();
    populateCategories();
    filterQuotes();

    alert("Quotes imported successfully!");
  };

  reader.readAsText(event.target.files[0]);
}

// -----------------------------
// INITIALIZE APP
// -----------------------------
window.onload = function () {
  createAddQuoteForm();
  populateCategories();

  const lastQuote = sessionStorage.getItem("lastQuote");

  if (lastQuote) {
    const q = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerText =
      `"${q.text}" — (${q.category})`;
  } else {
    showRandomQuote();
  }

  document
    .getElementById("newQuote")
    .addEventListener("click", showRandomQuote);
};
