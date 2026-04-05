function sendMessage(event) {
  event.preventDefault();

  const status = document.getElementById("status");
  const form = document.querySelector("form");

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  // Basic validation (NEW 🔥)
  if (!name || !email || !message) {
    status.innerText = "⚠️ Please fill all fields.";
    return;
  }

  status.innerText = "Sending...";

  const params = { name, email, message };

  emailjs.send(
    "service_a7ayyfv",
    "template_4acypww",
    params
  )
  .then(() => {
    status.innerText = "✅ Message sent successfully!";
    form.reset();
  })
  .catch((error) => {
    status.innerText = "❌ Failed to send message. Try again.";
    console.error(error);
  });
}

function goBack() {
  window.history.back();
}