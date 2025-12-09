// Initial quotes
let quotes = [
    { text: "Success is not final, failure is not fatal.", author: "Winston Churchill", category: "Motivation" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "Motivation" },
    { text: "The purpose of our lives is to be happy.", author: "Dalai Lama", category: "Life" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "Life" }
];

// DOM Elements
const categorySelect = document.getElementById("categorySelect");
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const addQuoteForm = document.getElementById("addQuoteForm");

// Extract unique categories & populate dropdown
function populateCategories() {
    categorySelect.innerHTML = ""; // clear existing

    let categories = [...new Set(quotes.map(q => q.category))];

    // Add default option
    let defaultOption = document.createElement("option");
    defaultOption.value = "all";
    defaultOption.textContent = "All Categories";
    categorySelect.appendChild(defaultOption);

    // Add the categories
    categories.forEach(cat => {
        let option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });

    // Restore last selected category
    let savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
        categorySelect.value = savedCategory;
        filterQuote();
    }
}

// Filter quotes based on category
function filterQuote() {
    let selectedCategory = categorySelect.value;

    localStorage.setItem("selectedCategory", selectedCategory);

    let filtered = selectedCategory === "all"
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);

    displayRandomQuote(filtered);
}

// Display a random quote from a list
function displayRandomQuote(list) {
    if (list.length === 0) {
        quoteText.textContent = "No quotes available.";
        quoteAuthor.textContent = "";
        return;
    }

    let random = list[Math.floor(Math.random() * list.length)];
    quoteText.textContent = `"${random.text}"`;
    quoteAuthor.textContent = `— ${random.author}`;
}

// Show random quote button event
newQuoteBtn.addEventListener("click", () => {
    filterQuote(); 
});

// Add quote function
addQuoteForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let text = document.getElementById("newQuoteText").value;
    let author = document.getElementById("newQuoteAuthor").value;
    let category = document.getElementById("newQuoteCategory").value;

    let newQuote = { text, author, category };

    quotes.push(newQuote);

    // Update dropdown with new category if needed
    populateCategories();

    addQuoteForm.reset();
});

// Initialize
populateCategories();
filterQuote();
