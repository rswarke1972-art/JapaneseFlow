fetch("data.json")
  .then(res => res.json())
  .then(data => {

    const storyKey = localStorage.getItem("currentStory");
    const story = data.stories[storyKey];

    const container = document.getElementById("storyContainer");

    if (!story) {
      container.innerText = "Story not found ❌";
      return;
    }

    story.content.forEach(item => {

      // 🔥 line break after sentence
      if (item.word === "。") {
        const br = document.createElement("br");
        container.appendChild(br);
        return;
      }

      const span = document.createElement("span");

      span.innerText = item.word;
      span.className = "word";

      span.onclick = () => {
        showMeaning(item, span);

        // highlight selected
        document.querySelectorAll(".word").forEach(w => w.classList.remove("active"));
        span.classList.add("active");
      };

      container.appendChild(span);
    });

  })
  .catch(err => {
    console.error("Error loading story:", err);
  });


// ===== POPUP =====
function showMeaning(item, element) {
  let popup = document.getElementById("popup");

  popup.innerHTML = `
    <div style="font-size:20px;">${item.word}</div>
    <div style="color:#38bdf8;">${item.romaji || ""}</div>
    <div>${item.meaning || ""}</div>
  `;

  popup.style.display = "block";

  // 🔥 Position near clicked word
  let rect = element.getBoundingClientRect();

  popup.style.top = (rect.top - 70) + "px";
  popup.style.left = (rect.left + rect.width / 2 - 50) + "px";
}


// ===== BACK BUTTON =====
function goBack() {
  window.history.back();
}