fetch("data.json")
  .then(res => res.json())
  .then(data => {
    const stories = data.stories;
    const container = document.getElementById("storyList");
    

    Object.keys(stories).forEach(key => {
      const btn = document.createElement("button");

      btn.className = "story-btn"; // 🔥 ADD THIS
      btn.innerText = stories[key].title;

      btn.onclick = () => {
        localStorage.setItem("currentStory", key);
        window.location.href = "story-viewer.html";
      };

      container.appendChild(btn);
    });
  });

  function goBack() {
  window.history.back();
}