document.addEventListener("DOMContentLoaded", () => {
  const taskDetailsPanel = document.getElementById("taskDetailsPanel");
  const closePanelBtn = document.getElementById("closePanelBtn");
  const saveBtn = document.getElementById("saveBtn");
  const deleteBtn = document.getElementById("deleteBtn");

  const calendarTitle = document.getElementById("calendarTitle");
  const calendarContainer = document.getElementById("calendarContainer");

  let currentDate = new Date();
  let currentView = "month";
  let selectedEvent = null; // track event being edited

  // ---- Calendar Rendering ----
  function renderCalendar() {
    calendarContainer.innerHTML = "";

    if (currentView === "month") renderMonth();
    if (currentView === "week") renderWeek();
    if (currentView === "day") renderDay();
  }

  function renderMonth() {
    calendarContainer.className = "month-view";
    calendarTitle.textContent = currentDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    let lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dayDiv = document.createElement("div");
      dayDiv.classList.add("day");
      dayDiv.dataset.date = `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }-${i}`;
      dayDiv.innerHTML = `<div class="day-number">${i}</div>`;
      calendarContainer.appendChild(dayDiv);
    }
  }

  function renderWeek() {
    calendarContainer.className = "week-view";
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    calendarTitle.textContent = `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);

      const dayDiv = document.createElement("div");
      dayDiv.classList.add("week-day");
      dayDiv.dataset.date = date.toISOString().split("T")[0];
      dayDiv.innerHTML = `<strong>${date.toDateString()}</strong>`;
      calendarContainer.appendChild(dayDiv);
    }
  }

  function renderDay() {
    calendarContainer.className = "day-view";
    calendarTitle.textContent = currentDate.toDateString();

    for (let h = 0; h < 24; h++) {
      const hourDiv = document.createElement("div");
      hourDiv.classList.add("hour");

      // convert to AM/PM
      const ampmHour = h > 12 ? h - 12 : h;
      const period = h >= 12 ? "PM" : "AM";
      const label = `${ampmHour}:00 ${period}`;

      hourDiv.dataset.time = `${h.toString().padStart(2, "0")}:00`;
      hourDiv.innerHTML = `<span class="hour-label">${label}</span>`;
      calendarContainer.appendChild(hourDiv);
    }
  }

  // ---- Navigation ----
  document.getElementById("dayView").onclick = () => {
    currentView = "day";
    renderCalendar();
  };
  document.getElementById("weekView").onclick = () => {
    currentView = "week";
    renderCalendar();
  };
  document.getElementById("monthView").onclick = () => {
    currentView = "month";
    renderCalendar();
  };

  document.getElementById("prevBtn").onclick = () => {
    if (currentView === "month")
      currentDate.setMonth(currentDate.getMonth() - 1);
    if (currentView === "week") currentDate.setDate(currentDate.getDate() - 7);
    if (currentView === "day") currentDate.setDate(currentDate.getDate() - 1);
    renderCalendar();
  };

  document.getElementById("nextBtn").onclick = () => {
    if (currentView === "month")
      currentDate.setMonth(currentDate.getMonth() + 1);
    if (currentView === "week") currentDate.setDate(currentDate.getDate() + 7);
    if (currentView === "day") currentDate.setDate(currentDate.getDate() + 1);
    renderCalendar();
  };

  // ---- Panel Open/Close ----
  document.getElementById("addEventBtn").addEventListener("click", () => {
    selectedEvent = null; // new event
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskDueDate").value = "";
    taskDetailsPanel.classList.add("open");
  });

  closePanelBtn.addEventListener("click", () => {
    taskDetailsPanel.classList.remove("open");
  });
  //----Save Event----
  saveBtn.addEventListener("click", () => {
    const title = document.getElementById("taskTitle").value.trim();
    const description = document.getElementById("taskDescription").value.trim();
    const dueDate = document.getElementById("taskDueDate").value;
    const dueTime = document.getElementById("taskDueTime").value;

    if (!title) {
      alert("Task title required!");
      return;
    }

    if (selectedEvent) {
      // --- Update existing event ---
      selectedEvent.textContent = title;
      selectedEvent.dataset.description = description;
      selectedEvent.dataset.dueDate = dueDate;
    } else {
      // --- Create new event ---
      const eventEl = document.createElement("div");
      eventEl.className = "event tag-blue"; // default color
      eventEl.textContent = title;
      eventEl.dataset.description = description;
      eventEl.dataset.dueDate = dueDate;

      // Attach click to edit
      eventEl.onclick = () => {
        selectedEvent = eventEl;
        document.getElementById("taskTitle").value = title;
        document.getElementById("taskDescription").value = description;
        document.getElementById("taskDueDate").value = dueDate;
        document.getElementById("taskDueTime").value = dueTime;
        taskDetailsPanel.classList.add("open");
      };

      if (dueDate) {
        // Month / Week -> append to correct date cell
        const dayCell = calendarContainer.querySelector(
          `[data-date="${dueDate}"]`
        );
        if (dayCell) dayCell.appendChild(eventEl);

        // Day view -> append to correct hour slot
        if (currentView === "day" && dueTime) {
          const hourCell = calendarContainer.querySelector(
            `[data-time="${dueTime}"]`
          );
          if (hourCell) hourCell.appendChild(eventEl);
        }
      } else {
        calendarContainer.appendChild(eventEl);
      }
    }

    taskDetailsPanel.classList.remove("open");
    selectedEvent = null; // reset after saving
  });

  // ---- Delete Event ----
  deleteBtn.addEventListener("click", () => {
    if (selectedEvent) {
      selectedEvent.remove();
      selectedEvent = null;
    }
    taskDetailsPanel.classList.remove("open");
  });

  renderCalendar();
});

//new code//
document.addEventListener("DOMContentLoaded", () => {
  const taskDetailsPanel = document.getElementById("taskDetailsPanel");
  const closePanelBtn = document.getElementById("closePanelBtn");
  const saveBtn = document.getElementById("saveBtn");
  const deleteBtn = document.getElementById("deleteBtn");

  const calendarTitle = document.getElementById("calendarTitle");
  const calendarContainer = document.getElementById("calendarContainer");

  let currentDate = new Date();
  let currentView = "month";
  let selectedEvent = null; // track event being edited

  // --- Central Data Model ---
  let events = [];

  // ---- Calendar Rendering ----
  function renderCalendar() {
    calendarContainer.innerHTML = "";

    if (currentView === "month") renderMonth();
    if (currentView === "week") renderWeek();
    if (currentView === "day") renderDay();

    // Re-attach listeners to new elements
    document.querySelectorAll(".event").forEach((eventEl) => {
      eventEl.addEventListener("click", (e) => {
        e.stopPropagation();
        selectedEvent = eventEl.dataset.id;

        const event = events.find((ev) => ev.id == selectedEvent);
        if (event) {
          document.getElementById("taskTitle").value = event.title;
          document.getElementById("taskDescription").value = event.description;
          document.getElementById("taskDueDate").value = event.dueDate;
          document.getElementById("taskDueTime").value = event.dueTime;
          taskDetailsPanel.classList.add("open");
        }
      });
    });
  }
  function renderMonth() {
    calendarContainer.className = "month-view";
    calendarTitle.textContent = currentDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    // Array of weekday names
    const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

    // Create and append the weekday headers
    weekdays.forEach((day) => {
      const dayHeader = document.createElement("div");
      dayHeader.classList.add("day-header");
      dayHeader.textContent = day;
      calendarContainer.appendChild(dayHeader);
    });

    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    // Add empty cells for the first week
    for (let i = 0; i < firstDayOfMonth; i++) {
      const emptyDiv = document.createElement("div");
      emptyDiv.classList.add("day");
      calendarContainer.appendChild(emptyDiv);
    }

    // Render each day of the month
    for (let i = 1; i <= lastDayOfMonth; i++) {
      const dayDiv = document.createElement("div");
      dayDiv.classList.add("day");
      const dateString = `${currentDate.getFullYear()}-${(
        currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${i.toString().padStart(2, "0")}`;
      dayDiv.dataset.date = dateString;
      dayDiv.innerHTML = `<div class="day-number">${i}</div>`;

      events
        .filter((e) => e.dueDate === dateString)
        .forEach((event) => {
          const eventEl = createEventElement(event);
          dayDiv.appendChild(eventEl);
        });

      calendarContainer.appendChild(dayDiv);
    }
  }

  function renderWeek() {
    calendarContainer.className = "week-view";

    // Add hour labels to the first column
    const hourHeader = document.createElement("div");
    hourHeader.classList.add("time-label");
    calendarContainer.appendChild(hourHeader);

    // Add day headers
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    // --- UPDATED LINE ---
    const startDay = weekStart.getDate();
    const endDay = weekEnd.getDate();
    const monthName = weekEnd.toLocaleString("default", { month: "long" });
    const year = weekEnd.getFullYear();
    calendarTitle.textContent = `${startDay}-${endDay} ${monthName} ${year}`;

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);

      const dayHeaderDiv = document.createElement("div");
      dayHeaderDiv.classList.add("week-day-header");

      // --- UPDATED LINES ---
      const dayOfWeek = date.toLocaleString("default", { weekday: "short" });
      const fullDate = date
        .toLocaleString("default", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
        .replace(",", "");

      dayHeaderDiv.innerHTML = `<strong>${fullDate}</strong><br>${dayOfWeek}`;
      // ----------------------

      calendarContainer.appendChild(dayHeaderDiv);
    }

    // Render the grid with hourly slots
    for (let h = 0; h < 24; h++) {
      const ampmHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const period = h >= 12 ? "PM" : "AM";
      const label = `${ampmHour}:00 ${period}`;
      const timeLabelDiv = document.createElement("div");
      timeLabelDiv.classList.add("time-label");
      timeLabelDiv.textContent = label;
      calendarContainer.appendChild(timeLabelDiv);

      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        const dateString = date.toISOString().split("T")[0];
        const hourDiv = document.createElement("div");
        hourDiv.classList.add("hour");
        hourDiv.dataset.date = dateString;
        hourDiv.dataset.time = `${h.toString().padStart(2, "0")}:00`;

        events
          .filter(
            (e) =>
              e.dueDate === dateString && e.dueTime === hourDiv.dataset.time
          )
          .forEach((event) => {
            const eventEl = createEventElement(event);
            hourDiv.appendChild(eventEl);
          });

        calendarContainer.appendChild(hourDiv);
      }
    }
  }
  function renderDay() {
    calendarContainer.className = "day-view";
    calendarTitle.textContent = currentDate.toDateString();

    // Create and append the day name header
    const dayNameHeader = document.createElement("div");
    dayNameHeader.classList.add("day-name-header");
    dayNameHeader.textContent = currentDate
      .toLocaleString("default", { weekday: "long" })
      .toUpperCase();
    calendarContainer.appendChild(dayNameHeader);

    for (let h = 0; h < 24; h++) {
      const hourDiv = document.createElement("div");
      hourDiv.classList.add("hour");
      const ampmHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const period = h >= 12 ? "PM" : "AM";
      const label = `${ampmHour}:00 ${period}`;
      hourDiv.dataset.time = `${h.toString().padStart(2, "0")}:00`;
      hourDiv.innerHTML = `<span class="hour-label">${label}</span>`;

      const dateString = currentDate.toISOString().split("T")[0];
      events
        .filter(
          (e) => e.dueDate === dateString && e.dueTime === hourDiv.dataset.time
        )
        .forEach((event) => {
          const eventEl = createEventElement(event);
          hourDiv.appendChild(eventEl);
        });

      calendarContainer.appendChild(hourDiv);
    }
  }

  // ---- Navigation ----
  document.getElementById("dayView").onclick = () => {
    currentView = "day";
    renderCalendar();
  };
  document.getElementById("weekView").onclick = () => {
    currentView = "week";
    renderCalendar();
  };
  document.getElementById("monthView").onclick = () => {
    currentView = "month";
    renderCalendar();
  };

  document.getElementById("prevBtn").onclick = () => {
    if (currentView === "month")
      currentDate.setMonth(currentDate.getMonth() - 1);
    if (currentView === "week") currentDate.setDate(currentDate.getDate() - 7);
    if (currentView === "day") currentDate.setDate(currentDate.getDate() - 1);
    renderCalendar();
  };

  document.getElementById("nextBtn").onclick = () => {
    if (currentView === "month")
      currentDate.setMonth(currentDate.getMonth() + 1);
    if (currentView === "week") currentDate.setDate(currentDate.getDate() + 7);
    if (currentView === "day") currentDate.setDate(currentDate.getDate() + 1);
    renderCalendar();
  };

  // ---- Panel Open/Close ----
  document.getElementById("addEventBtn").addEventListener("click", () => {
    selectedEvent = null; // new event
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskDueDate").value = "";
    taskDetailsPanel.classList.add("open");
  });

  closePanelBtn.addEventListener("click", () => {
    taskDetailsPanel.classList.remove("open");
  });
  //----Save Event----
  saveBtn.addEventListener("click", () => {
    const title = document.getElementById("taskTitle").value.trim();
    const description = document.getElementById("taskDescription").value.trim();
    const dueDate = document.getElementById("taskDueDate").value;
    const dueTime = document.getElementById("taskDueTime").value;

    if (!title) {
      alert("Task title required!");
      return;
    }

    if (selectedEvent) {
      // --- Update existing event ---
      selectedEvent.textContent = title;
      selectedEvent.dataset.description = description;
      selectedEvent.dataset.dueDate = dueDate;
    } else {
      // --- Create new event ---
      const eventEl = document.createElement("div");
      eventEl.className = "event tag-blue"; // default color
      eventEl.textContent = title;
      eventEl.dataset.description = description;
      eventEl.dataset.dueDate = dueDate;

      // Attach click to edit
      eventEl.onclick = () => {
        selectedEvent = eventEl;
        document.getElementById("taskTitle").value = title;
        document.getElementById("taskDescription").value = description;
        document.getElementById("taskDueDate").value = dueDate;
        document.getElementById("taskDueTime").value = dueTime;
        taskDetailsPanel.classList.add("open");
      };

      if (dueDate) {
        // Month / Week -> append to correct date cell
        const dayCell = calendarContainer.querySelector(
          `[data-date="${dueDate}"]`
        );
        if (dayCell) dayCell.appendChild(eventEl);

        // Day view -> append to correct hour slot
        if (currentView === "day" && dueTime) {
          const hourCell = calendarContainer.querySelector(
            `[data-time="${dueTime}"]`
          );
          if (hourCell) hourCell.appendChild(eventEl);
        }
      } else {
        calendarContainer.appendChild(eventEl);
      }
    }

    taskDetailsPanel.classList.remove("open");
    selectedEvent = null; // reset after saving
  });

  // ---- Delete Event ----
  deleteBtn.addEventListener("click", () => {
    if (selectedEvent) {
      selectedEvent.remove();
      selectedEvent = null;
    }
    taskDetailsPanel.classList.remove("open");
  });

  renderCalendar();
});
