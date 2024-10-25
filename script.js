document.getElementById("eventForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const dateInput = document.getElementById("date").value;
  const timeInput = document.getElementById("time").value;
  const descriptionInput = document.getElementById("description").value;
  const linkInput = document.getElementById("link").value;

  const date = new Date(dateInput);
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
  const epochTime = Math.floor(date.getTime() / 1000);

  let eventText = `- <t:${epochTime}:t> — ${descriptionInput}`;
  if (linkInput) {
    eventText += ` [${descriptionInput}](${linkInput})`;
  }

  // Append formatted event to the output
  const output = document.getElementById("output");
  const dayHeader = document.createElement("h3");
  dayHeader.textContent = dayName;
  output.appendChild(dayHeader);

  const eventItem = document.createElement("p");
  eventItem.innerHTML = eventText;
  output.appendChild(eventItem);

  // Reset the form fields
  document.getElementById("eventForm").reset();
});
