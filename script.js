const events = [];
let selectedDateTime = new Date().toISOString();

document.getElementById("eventForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const descriptionInput = document.getElementById("description").value;
  const linkInput = document.getElementById("link").value;
  const showRelativeTime = document.getElementById("relativeTime").checked;
  const dateOnly = document.getElementById("dateOnly").checked;

  if (!selectedDateTime) {
    alert("Please select a date and time.");
    return;
  }

  const date = new Date(selectedDateTime);

  if (isNaN(date)) {
    alert("Invalid date or time format. Please check your inputs.");
    return;
  }

  const epochTime = Math.floor(date.getTime() / 1000);
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
  const day = date.getDate();
  const formattedDate = `${dayName} - ${day}${getDaySuffix(day)}`;

  events.push({
    date: date,
    formattedDate: formattedDate,
    epochTime: epochTime,
    description: descriptionInput,
    link: linkInput,
    showRelativeTime: showRelativeTime,
    dateOnly: dateOnly
  });

  document.getElementById("description").value = "";
  document.getElementById("link").value = "";
  // document.getElementById("relativeTime").checked = false;
  document.getElementById("dateOnly").checked = false;

  updateScheduleOutput();
});

function updateScheduleOutput() {
  events.sort((a, b) => a.date - b.date);

  const output = document.getElementById("output");
  let outputText = "";

  let currentDay = "";
  events.forEach(event => {
    if (event.formattedDate !== currentDay) {
      outputText += `### __${event.formattedDate}__\n`;
      currentDay = event.formattedDate;
    }

    let eventText = event.dateOnly ? `-` : `- **<t:${event.epochTime}:t>**`;
    if (event.showRelativeTime && !event.dateOnly) {
      eventText += ` (**<t:${event.epochTime}:R>**)`;
    }
    
	eventText += event.dateOnly ? ` ` : ` — `;
    if (event.link) {
      eventText += `[${event.description}](${event.link})`;
    } else {
      eventText += `${event.description}`;
    }

    outputText += `${eventText}\n`;
  });

  outputText += `-# Times are shown in your local timezone.`;
  output.innerText = outputText;
}


function getDaySuffix(day) {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

flatpickr("#datetimePickerContainer", {
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  time_24hr: true,
  defaultDate: new Date(),
  inline: true,
  minuteIncrement: 1,
  onChange: function (selectedDates) {
    if (selectedDates.length > 0) {
      selectedDateTime = selectedDates[0].toISOString();
    }
  }
});

document.getElementById("copyButton").addEventListener("click", function () {
  const outputElement = document.getElementById("output");
  const textToCopy = outputElement.innerText;
  const textarea = document.createElement("textarea");

  textarea.value = textToCopy;
  textarea.style.position = "fixed";
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, 99999);

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      alert("Schedule copied to clipboard!");
    } else {
      alert("Failed to copy schedule. Please try again.");
    }
  } catch (err) {
    alert("Failed to copy schedule: " + err);
  }

  document.body.removeChild(textarea);
});
