// === Dynamic Search with Grid Layout ===

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const tagFilters = document.querySelectorAll(".tag-filter");

  let recipes = [];

  fetch("recipes.json")
    .then(response => response.json())
    .then(data => {
      recipes = data;
      const params = new URLSearchParams(window.location.search);
      const query = params.get("query") || "";
      if (query) {
        searchInput.value = query;
      }
      performSearch();
    })
    .catch(err => {
      console.error("Failed to load recipes.json", err);
      searchResults.innerHTML = "<p>Error loading recipes.</p>";
    });

  window.performSearch = function () {
    const text = searchInput.value.trim().toLowerCase();
    const selectedTags = Array.from(tagFilters)
      .filter(checkbox => checkbox.checked)
      .map(cb => cb.value.toLowerCase());

    const filtered = recipes.filter(recipe => {
      const matchesText = recipe.title.toLowerCase().includes(text) ||
        recipe.tags.some(tag => tag.includes(text));

      const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => recipe.tags.includes(tag));

      return matchesText && matchesTags;
    });

    displayResults(filtered);
  };

  function displayResults(results) {
    searchResults.innerHTML = "";
    searchResults.className = "search-grid";

    if (results.length === 0) {
      searchResults.innerHTML = "<p>No matching recipes found.</p>";
      return;
    }

    results.forEach(recipe => {
      const card = document.createElement("div");
      card.className = "recipe-card";

      const img = document.createElement("img");
      img.src = recipe.image || "media/placeholder.png";
      img.alt = recipe.title;

      const title = document.createElement("h3");
      const link = document.createElement("a");
      link.href = recipe.file;
      link.textContent = recipe.title;
      title.appendChild(link);

      const tagLine = document.createElement("p");
      tagLine.className = "tags";
      tagLine.textContent = recipe.tags.map(tag => `#${tag}`).join("  ");

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(tagLine);

      searchResults.appendChild(card);
    });
  }
});
