const events = [];

document.getElementById("eventForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const dateInput = document.getElementById("date").value; // e.g., "2024-10-25"
  const timeInput = document.getElementById("time").value; // e.g., "08:30 PM"
  const descriptionInput = document.getElementById("description").value;
  const linkInput = document.getElementById("link").value;
  const showRelativeTime = document.getElementById("relativeTime").checked;
  const [year, month, day] = dateInput.split("-").map(Number);
  let [hour, minute] = timeInput.match(/\d+/g).map(Number);
  const isPM = timeInput.toLowerCase().includes("pm");

  if (isPM && hour < 12) hour += 12; // Convert PM to 24-hour time
  if (!isPM && hour === 12) hour = 0; // Convert 12 AM to 0 hours

  const date = new Date(year, month - 1, day, hour, minute);

  if (isNaN(date)) {
    alert("Invalid date or time format. Please check your inputs.");
    return;
  }

  // Get the Unix timestamp and day name
  const epochTime = Math.floor(date.getTime() / 1000);
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

  events.push({
    date: date,
    dayName: dayName,
    epochTime: epochTime,
    description: descriptionInput,
    link: linkInput,
    showRelativeTime: showRelativeTime
  });

  document.getElementById("eventForm").reset();
  document.getElementById("relativeTime").checked = showRelativeTime;

  // Update the displayed schedule
  updateScheduleOutput();
});

function updateScheduleOutput() {
  events.sort((a, b) => a.date - b.date);

  const output = document.getElementById("output");
  output.innerText = "";

  let currentDay = "";
  events.forEach(event => {
    if (event.dayName !== currentDay) {
      output.innerText += `### ${event.dayName}\n`;
      currentDay = event.dayName;
    }
    
    let eventText = `- <t:${event.epochTime}:t>`;
    if (event.showRelativeTime) {
      eventText += ` (<t:${event.epochTime}:R>)`;
    }
    
    if (event.link) {
      eventText += ` - [${event.description}](${event.link})`;
    } else {
      eventText += ` — ${event.description}`;
    }
    
    output.innerText += `${eventText}\n`;
  });
}
