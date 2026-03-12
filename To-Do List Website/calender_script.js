document.addEventListener("DOMContentLoaded", () => {
  const taskDetailsPanel = document.getElementById("taskDetailsPanel");
  const closePanelBtn = document.getElementById("closePanelBtn");
  const saveBtn = document.getElementById("saveBtn");
  const deleteBtn = document.getElementById("deleteBtn");

  const calendarTitle = document.getElementById("calendarTitle");
  const calendarContainer = document.getElementById("calendarContainer");

  let currentDate = new Date();
  let currentView = "day";
  let selectedEventId = null;

  // --- Central Data Model ---
  let events = JSON.parse(localStorage.getItem("calendarEvents") || "[]");

  // ---- Calendar Rendering ----
  function renderCalendar() {
    calendarContainer.innerHTML = "";

    if (currentView === "month") renderMonth();
    if (currentView === "week") renderWeek();
    if (currentView === "day") renderDay();

    // Attach click listeners to events for editing
    document.querySelectorAll(".event").forEach((eventEl) => {
      eventEl.addEventListener("click", (e) => {
        e.stopPropagation();
        selectedEventId = eventEl.dataset.id;
        const event = events.find((ev) => ev.id == selectedEventId);
        if (event) {
          document.getElementById("taskTitle").value = event.title;
          document.getElementById("taskDescription").value = event.description;
          document.getElementById("taskDueDate").value = event.dueDate;
          document.getElementById("taskDueTime").value = event.dueTime;
          if (document.getElementById("taskTag")) {
            document.getElementById("taskTag").value = event.tag || "tag-blue";
          }
          taskDetailsPanel.classList.add("open");
        }
      });
    });
  }
  // ...existing code...

  function updateSidebarCounts() {
    const calendarEvents = JSON.parse(
      localStorage.getItem("calendarEvents") || "[]"
    );
    const allTasks = JSON.parse(localStorage.getItem("allTasks") || "{}");

    const combinedTasks = [...calendarEvents];

    for (const list in allTasks) {
      if (Array.isArray(allTasks[list])) {
        allTasks[list].forEach((task) => {
          if (!combinedTasks.some((event) => event.id === task.id)) {
            combinedTasks.push({ ...task, dueDate: task.due });
          }
        });
      }
    }

    // Count for each list
    let personalCount = combinedTasks.filter(
      (e) => e.list === "Personal"
    ).length;
    let workCount = combinedTasks.filter((e) => e.list === "Work").length;
    let list1Count = combinedTasks.filter((e) => e.list === "List 1").length;

    // Today and Upcoming counts
    const todayStr = new Date().toISOString().split("T")[0];
    let todayCount = combinedTasks.filter((e) => e.dueDate === todayStr).length;
    let upcomingCount = combinedTasks.filter(
      (e) => new Date(e.dueDate) >= new Date(todayStr)
    ).length;

    // Update sidebar elements if they exist
    if (document.getElementById("personalCount"))
      document.getElementById("personalCount").textContent = personalCount;
    if (document.getElementById("workCount"))
      document.getElementById("workCount").textContent = workCount;
    if (document.getElementById("list1Count"))
      document.getElementById("list1Count").textContent = list1Count;
    if (document.getElementById("todayCount"))
      document.getElementById("todayCount").textContent = todayCount;
    if (document.getElementById("upcomingCount"))
      document.getElementById("upcomingCount").textContent = upcomingCount;
  }

  // ...existing code...

  function renderMonth() {
    calendarContainer.className = "month-view";
    calendarTitle.textContent = currentDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

    for (let i = 0; i < firstDayOfMonth; i++) {
      const emptyDiv = document.createElement("div");
      emptyDiv.classList.add("day");
      calendarContainer.appendChild(emptyDiv);
    }

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

  // --- DO NOT CHANGE WEEK PAGE ---
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
      const dayOfWeek = date.toLocaleString("default", { weekday: "short" });
      const fullDate = date
        .toLocaleString("default", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
        .replace(",", "");
      dayHeaderDiv.innerHTML = `<strong>${fullDate}</strong><br>${dayOfWeek}`;
      calendarContainer.appendChild(dayHeaderDiv);
    }

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
        const dateString = [
          date.getFullYear(),
          String(date.getMonth() + 1).padStart(2, "0"),
          String(date.getDate()).padStart(2, "0"),
        ].join("-");
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
    calendarTitle.textContent =
      `${currentDate.getDate()} ` +
      `${currentDate.toLocaleString("default", { month: "long" })} ` +
      `${currentDate.getFullYear()}`;

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

      const dateString = [
        currentDate.getFullYear(),
        String(currentDate.getMonth() + 1).padStart(2, "0"),
        String(currentDate.getDate()).padStart(2, "0"),
      ].join("-");
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

  function createEventElement(event) {
    const eventEl = document.createElement("div");
    eventEl.className = `event ${event.tag || "tag-blue"}`;
    eventEl.textContent = event.title;
    eventEl.dataset.id = event.id;
    eventEl.dataset.description = event.description;
    eventEl.dataset.dueDate = event.dueDate;
    eventEl.dataset.dueTime = event.dueTime;
    eventEl.dataset.tag = event.tag;
    return eventEl;
  }

  // ---- Navigation ----
  document.getElementById("dayView").onclick = () => {
    currentView = "day";
    renderCalendar();
    updateSidebarCounts();
  };
  document.getElementById("weekView").onclick = () => {
    currentView = "week";
    renderCalendar();
    updateSidebarCounts();
  };
  document.getElementById("monthView").onclick = () => {
    currentView = "month";
    renderCalendar();
    updateSidebarCounts();
  };

  document.getElementById("prevBtn").onclick = () => {
    if (currentView === "month")
      currentDate.setMonth(currentDate.getMonth() - 1);
    if (currentView === "week") currentDate.setDate(currentDate.getDate() - 7);
    if (currentView === "day") currentDate.setDate(currentDate.getDate() - 1);
    renderCalendar();
    updateSidebarCounts();
  };

  document.getElementById("nextBtn").onclick = () => {
    if (currentView === "month")
      currentDate.setMonth(currentDate.getMonth() + 1);
    if (currentView === "week") currentDate.setDate(currentDate.getDate() + 7);
    if (currentView === "day") currentDate.setDate(currentDate.getDate() + 1);
    renderCalendar();
    updateSidebarCounts();
  };

  // ---- Panel Open/Close ----
  document.getElementById("addEventBtn").addEventListener("click", () => {
    selectedEventId = null; // New event
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
    // Pre-fill date and time with current date and 09:00
    const todayStr = currentDate.toISOString().split("T")[0];
    document.getElementById("taskDueDate").value = todayStr;
    document.getElementById("taskDueTime").value = "00:00";
    if (document.getElementById("taskTag")) {
      document.getElementById("taskTag").value = "tag-blue";
    }
    taskDetailsPanel.classList.add("open");
  });

  closePanelBtn.addEventListener("click", () => {
    taskDetailsPanel.classList.remove("open");
  });

  // ---- Save Event ----
  saveBtn.addEventListener("click", () => {
    const title = document.getElementById("taskTitle").value.trim();
    const description = document.getElementById("taskDescription").value.trim();
    const dueDate = document.getElementById("taskDueDate").value;
    const dueTime = document.getElementById("taskDueTime").value;
    const list = document.getElementById("taskList").value;
    const tag = document.getElementById("taskTag")
      ? document.getElementById("taskTag").value
      : "tag-blue";

    if (!title) {
      alert("Task title required!");
      return;
    }
    if (!dueDate) {
      alert("Please select a date.");
      return;
    }
    // For week/day view, require time
    if ((currentView === "week" || currentView === "day") && !dueTime) {
      alert("Please select a time.");
      return;
    }

    let allTasks = JSON.parse(localStorage.getItem("allTasks") || "{}");
    if (!allTasks[list]) {
      allTasks[list] = [];
    }

    if (selectedEventId) {
      // --- Update existing event ---
      const event = events.find((ev) => ev.id == selectedEventId);
      if (event) {
        const oldList = event.list;
        event.title = title;
        event.description = description;
        event.dueDate = dueDate;
        event.dueTime = dueTime;
        event.tag = tag;
        event.list = list;

        // Also update in allTasks
        if (allTasks[oldList]) {
          const taskIndex = allTasks[oldList].findIndex(
            (t) => t.id == selectedEventId
          );
          if (taskIndex > -1) {
            allTasks[oldList].splice(taskIndex, 1);
          }
        }
        if (!allTasks[list]) {
          allTasks[list] = [];
        }
        allTasks[list].push(event);
      }
    } else {
      // --- Create new event ---
      const newEvent = {
        id: Date.now(),
        title,
        description,
        dueDate,
        dueTime,
        tag,
        list,
        due: dueDate, // for compatibility
      };
      events.push(newEvent);
      allTasks[list].push(newEvent);
    }

    localStorage.setItem("calendarEvents", JSON.stringify(events));
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
    taskDetailsPanel.classList.remove("open");
    selectedEventId = null;
    events = JSON.parse(localStorage.getItem("calendarEvents") || "[]");
    renderCalendar();
    updateSidebarCounts();
  });

  // ---- Delete Event ----
  deleteBtn.addEventListener("click", () => {
    if (selectedEventId) {
      events = events.filter((ev) => ev.id != selectedEventId);
      localStorage.setItem("calendarEvents", JSON.stringify(events));
      selectedEventId = null;
    }
    taskDetailsPanel.classList.remove("open");
    events = JSON.parse(localStorage.getItem("calendarEvents") || "[]");
    renderCalendar();
    updateSidebarCounts();
  });

  renderCalendar();
  updateSidebarCounts();
});
