/* ---------------------------------------------
   Initial Data + Load From Storage
--------------------------------------------- */

let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { id: 1, text: "Believe in yourself.", category: "Motivation", updatedAt: 1 },
    { id: 2, text: "Keep pushing forward.", category: "Inspiration", updatedAt: 1 }
];

/* ---------------------------------------------
   Mock Server Simulation (ALX Task 3)
--------------------------------------------- */

let mockServerQuotes = [
    { id: 1, text: "Believe in yourself.", category: "Motivation", updatedAt: 1 },
    { id: 2, text: "Keep pushing forward.", category: "Inspiration", updatedAt: 1 }
];

async function fetchQuotesFromServer() {
    return new Promise(resolve => {
        setTimeout(() => resolve(mockServerQuotes), 500);
    });
}

async function postQuoteToServer(newQuote) {
    return new Promise(resolve => {
        setTimeout(() => {
            mockServerQuotes.push(newQuote);
            resolve(newQuote);
        }, 300);
    });
}

/* ---------------------------------------------
   Save Quotes to Local Storage
--------------------------------------------- */

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

/* ---------------------------------------------
   Display Random Quote
--------------------------------------------- */

function showRandomQuote() {
    if (quotes.length === 0) return;
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById("quoteDisplay").innerText =
        `"${random.text}" — (${random.category})`;
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

/* ---------------------------------------------
   Add New Quote
--------------------------------------------- */

async function addQuote() {
    const text = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim();

    if (!text || !category) {
        alert("Please enter both text and category.");
        return;
    }

    const newQuote = {
        id: Date.now(),
        text,
        category,
        updatedAt: Date.now()
    };

    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    filterQuotes();

    await postQuoteToServer(newQuote); // Sync to server

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
}

/* ---------------------------------------------
   Populate Dropdown Categories
--------------------------------------------- */

function populateCategories() {
    const select = document.getElementById("categoryFilter");

    // Clear current categories
    select.innerHTML = `<option value="all">All Categories</option>`;

    // Extract unique categories
    const categories = [...new Set(quotes.map(q => q.category))];

    // Add each category
    categories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
    });

    // Restore selected category
    const savedFilter = localStorage.getItem("selectedCategory");
    if (savedFilter) select.value = savedFilter;
}

/* ---------------------------------------------
   Filter Quotes by Category
--------------------------------------------- */

function filterQuotes() {
    const selected = document.getElementById("categoryFilter").value;

    localStorage.setItem("selectedCategory", selected);

    if (selected === "all") {
        showRandomQuote();
        return;
    }

    const filtered = quotes.filter(q => q.category === selected);

    if (filtered.length > 0) {
        const random = filtered[Math.floor(Math.random() * filtered.length)];
        document.getElementById("quoteDisplay").innerText =
            `"${random.text}" — (${random.category})`;
    } else {
        document.getElementById("quoteDisplay").innerText =
            "No quotes found in this category.";
    }
}

/* ---------------------------------------------
   JSON Export
--------------------------------------------- */

function exportToJson() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
}

/* ---------------------------------------------
   JSON Import
--------------------------------------------- */

function importFromJsonFile(event) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const importedQuotes = JSON.parse(e.target.result);

        importedQuotes.forEach(q => {
            q.updatedAt = Date.now();
            q.id = q.id || Date.now();
        });

        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
    };

    reader.readAsText(event.target.files[0]);
}

/* ---------------------------------------------
   Sync Quotes With Server + Conflict Resolution
--------------------------------------------- */

async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    let updated = false;

    // Merge logic — server wins on conflict
    serverQuotes.forEach(serverQ => {
        const localQ = quotes.find(q => q.id === serverQ.id);

        if (!localQ) {
            quotes.push(serverQ);
            updated = true;
        } else if (serverQ.updatedAt > localQ.updatedAt) {
            Object.assign(localQ, serverQ);
            updated = true;
        }
    });

    if (updated) {
        saveQuotes();
        populateCategories();
        showUpdateNotification();
    }
}

function showUpdateNotification() {
    const note = document.getElementById("updateNotification");
    note.style.display = "block";
    setTimeout(() => note.style.display = "none", 3000);
}

// Sync every 10 seconds
setInterval(syncQuotes, 10000);

/* ---------------------------------------------
   Initialize
--------------------------------------------- */

window.onload = function () {
    populateCategories();
    filterQuotes();
    syncQuotes();
};
