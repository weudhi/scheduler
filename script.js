document.getElementById("eventForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Retrieve form values
  const dateInput = document.getElementById("date").value;
  const timeInput = document.getElementById("time").value;
  const descriptionInput = document.getElementById("description").value;
  const linkInput = document.getElementById("link").value;

  // Combine date and time, then create a Date object
  const dateTimeString = `${dateInput}T${timeInput}:00`; // Format as "YYYY-MM-DDTHH:MM:SS"
  const date = new Date(dateTimeString);

  // Check if the date is valid
  if (isNaN(date)) {
    alert("Invalid date or time format. Please check your inputs.");
    return;
  }

  // Get the day name and the Unix timestamp for the Discord format
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
  const epochTime = Math.floor(date.getTime() / 1000);

  // Format the event text with Markdown
  let eventText = `- <t:${epochTime}:t> — ${descriptionInput}`;
  if (linkInput) {
    eventText += ` [${descriptionInput}](${linkInput})`;
  }

  // Append formatted event to the output
  const output = document.getElementById("output");
  
  // Wrap entire schedule output in a code block
  if (output.innerHTML === "") {
    output.innerHTML = "```markdown\n"; // Start the code block with Markdown hint
  }

  // Add day header if it's a new day
  const existingHeader = Array.from(output.querySelectorAll("h3")).find(header => header.textContent === dayName);
  if (!existingHeader) {
    output.innerHTML += `\n### ${dayName}\n`; // Add the day as a header
  }

  // Add event line with formatted time
  output.innerHTML += `${eventText}\n`;

  // End the code block when done
  output.innerHTML += "```";
  
  // Reset the form fields
  document.getElementById("eventForm").reset();
});
