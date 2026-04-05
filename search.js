let allCharacters = [];

// ===== LOAD DATA =====
async function loadData() {
  try {
    let res = await fetch("data.json");
    let data = await res.json();

    // 🔥 IMPORTANT: get ALL characters
    allCharacters = getAllCharacters(data);

    console.log("Total characters loaded:", allCharacters.length);

  } catch (err) {
    console.error("Error loading data:", err);
  }
}

// ===== GET ALL CHARACTERS =====
function getAllCharacters(data) {
  let all = [];

  // hiragana
  if (data.hiragana) {
    Object.values(data.hiragana).forEach(level => {
      if (Array.isArray(level)) {
        all = all.concat(level);
      }
    });
  }

  // katakana
  if (data.katakana) {
    Object.values(data.katakana).forEach(level => {
      if (Array.isArray(level)) {
        all = all.concat(level);
      }
    });
  }

  // kanji
  if (data.kanji) {
    Object.values(data.kanji).forEach(level => {
      if (Array.isArray(level)) {
        all = all.concat(level);
      }
    });
  }

  return all;
}

// ===== SEARCH FUNCTION =====
function search() {
  let query = document.getElementById("searchInput").value.toLowerCase().trim();
  let resultsDiv = document.getElementById("results");

  resultsDiv.innerHTML = "";

  if (!query) return;

  let results = allCharacters.filter(char => {
    return (
      (char.char && char.char.includes(query)) ||
      (char.romaji && char.romaji.toLowerCase().includes(query)) ||
      (char.meaning && char.meaning.toLowerCase().includes(query))
    );
  });

  if (results.length === 0) {
    resultsDiv.innerHTML = "<p>No results found</p>";
    return;
  }

  results.forEach(char => {
    let div = document.createElement("div");
    div.className = "result-card";

    div.innerHTML = `
      <h2>${char.char || ""}</h2>
      <p>${char.romaji || ""}</p>
      <p>${char.meaning || ""}</p>
    `;

    // 🔥 click → open viewer
    div.onclick = () => {
      localStorage.setItem("character", JSON.stringify(char));
      localStorage.setItem("script", "all"); // now universal
      window.location.href = "viewer.html";
    };

    resultsDiv.appendChild(div);
  });
}

// ===== BACK BUTTON =====
function goBack() {
  window.history.back();
}

// ===== INIT =====
loadData();