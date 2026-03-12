document.addEventListener("DOMContentLoaded", function () {
  // --- Central Data Store (shared across all pages) ---
  let allTasks = {
    Personal: [],
    Work: [],
    "List 1": [],
    None: [],
  };
  let selectedTask = null;
  let selectedListKey = null;

  // --- Helper Functions for Local Storage ---
  function saveTasks() {
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
  }
  function loadTasks() {
    const storedTasks = localStorage.getItem("allTasks");
    if (storedTasks) {
      allTasks = JSON.parse(storedTasks);
    }
  }

  // --- Date Helper Functions ---
  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const day = String(tomorrow.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  function getWeekFromNowDate() {
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    const year = weekFromNow.getFullYear();
    const month = String(weekFromNow.getMonth() + 1).padStart(2, "0");
    const day = String(weekFromNow.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // --- Unified Function to Update All Counts ---
  function updateAllCounts() {
    const today = getTodayDate();
    const allAppTasks = Object.values(allTasks).flat();

    // Count tasks for Today
    const todayTasksCount = allAppTasks.filter(
      (task) => !task.due || task.due === today
    ).length;

    // Count tasks for Upcoming
    const upcomingTotal = allAppTasks.filter(
      (task) => task.due && task.due >= today
    ).length;

    // Update Today and Upcoming counts
    const todayCountElement = document.getElementById("todayCount");
    const mainTaskCountElement = document.getElementById("mainTaskCount");
    if (todayCountElement) todayCountElement.textContent = todayTasksCount;
    if (mainTaskCountElement)
      mainTaskCountElement.textContent = todayTasksCount;
    const upcomingCountElement = document.getElementById("upcomingCount");
    if (upcomingCountElement) upcomingCountElement.textContent = upcomingTotal;

    // Update specific list counts
    const personalCountElement = document.getElementById("personalCount");
    const workCountElement = document.getElementById("workCount");
    const list1CountElement = document.getElementById("list1Count");
    if (personalCountElement)
      personalCountElement.textContent = allTasks.Personal.length || 0;
    if (workCountElement)
      workCountElement.textContent = allTasks.Work.length || 0;
    if (list1CountElement)
      list1CountElement.textContent = allTasks["List 1"].length || 0;

    // Update header count for list pages
    const pageTitle = document.getElementById("pageTitle");
    const headerCountElement = document.querySelector(".task-header .count");
    if (pageTitle && headerCountElement) {
      const listName = pageTitle.textContent.trim();
      const listTasksCount = allTasks[listName]?.length || 0;
      headerCountElement.textContent = listTasksCount;
    }
  }

  // --- Dynamic Rendering Based on URL ---
  function renderTasks() {
    const todayPageContainer = document.querySelector(".task-list");
    const upcomingSections = document.querySelector(".upcoming-sections");
    const listPageContainer = document.querySelector(".list-page-container");

    if (todayPageContainer) {
      const tasksUl = document.getElementById("tasks");
      if (!tasksUl) return;
      tasksUl.innerHTML = "";
      const today = getTodayDate();
      const todayTasks = Object.values(allTasks)
        .flat()
        .filter((task) => !task.due || task.due === today);
      todayTasks.forEach((task) => {
        renderTaskItem(task, tasksUl, "today");
      });
    }

    if (upcomingSections) {
      const today = getTodayDate();
      const tomorrow = getTomorrowDate();
      const weekFromNow = getWeekFromNowDate();
      const allAppTasks = Object.values(allTasks).flat();
      const upcomingTodayTasks = allAppTasks.filter(
        (task) => !task.due || task.due === today
      );
      const upcomingTomorrowTasks = allAppTasks.filter(
        (task) => task.due === tomorrow
      );
      const upcomingWeekTasks = allAppTasks.filter(
        (task) => task.due > tomorrow && task.due <= weekFromNow
      );
      const upcomingTodayList = document.getElementById("upcomingTodayTasks");
      const upcomingTomorrowList = document.getElementById(
        "upcomingTomorrowTasks"
      );
      const upcomingWeekList = document.getElementById("upcomingWeekTasks");
      if (upcomingTodayList) upcomingTodayList.innerHTML = "";
      if (upcomingTomorrowList) upcomingTomorrowList.innerHTML = "";
      if (upcomingWeekList) upcomingWeekList.innerHTML = "";
      upcomingTodayTasks.forEach((task) =>
        renderTaskItem(task, upcomingTodayList, "upcoming")
      );
      upcomingTomorrowTasks.forEach((task) =>
        renderTaskItem(task, upcomingTomorrowList, "upcoming")
      );
      upcomingWeekTasks.forEach((task) =>
        renderTaskItem(task, upcomingWeekList, "upcoming")
      );
      const upcomingPageTodayCount =
        document.getElementById("upcomingTodayCount");
      const upcomingPageTomorrowCount = document.getElementById(
        "upcomingTomorrowCount"
      );
      const upcomingPageWeekCount =
        document.getElementById("upcomingWeekCount");
      const upcomingPageMainCount =
        document.getElementById("mainUpcomingCount");
      if (upcomingPageTodayCount)
        upcomingPageTodayCount.textContent = upcomingTodayTasks.length;
      if (upcomingPageTomorrowCount)
        upcomingPageTomorrowCount.textContent = upcomingTomorrowTasks.length;
      if (upcomingPageWeekCount)
        upcomingPageWeekCount.textContent = upcomingWeekTasks.length;
      if (upcomingPageMainCount)
        upcomingPageMainCount.textContent =
          upcomingTodayTasks.length +
          upcomingTomorrowTasks.length +
          upcomingWeekTasks.length;
    }

    // --- NEW: Render tasks for specific lists ---
    if (listPageContainer) {
      const pageTitle = document.getElementById("pageTitle");
      const listName = pageTitle ? pageTitle.textContent.trim() : "";
      if (listName) {
        renderListTasks(listName);
      }
    }
  }

  // --- NEW FUNCTION: Renders tasks for a specific list ---
  function renderListTasks(listKey) {
    const tasksUl = document.getElementById("listTasks");
    if (!tasksUl) return;
    tasksUl.innerHTML = "";
    const listTasks = allTasks[listKey] || [];
    listTasks.forEach((task) => {
      renderTaskItem(task, tasksUl, "list");
    });
    updateAllCounts();
  }

  function renderTaskItem(task, listElement, page) {
    if (!listElement) return;
    const li = document.createElement("li");
    li.className = "task-row";
    let colorClass = "";
    if (task.list === "Personal") colorClass = "pink-badge";
    if (task.list === "Work") colorClass = "blue-badge";
    if (task.list === "List 1") colorClass = "yellow-badge";
    let listTagHtml = "";
    if (task.list && task.list !== "None") {
      listTagHtml = `<span class="task-tag list-tag ${colorClass}">${task.list}</span>`;
    }
    const subtasksCount = task.subtasks ? task.subtasks.length : 0;
    const dateTag = task.due
      ? `<span class="task-tag date-tag"><span class="icon">📅</span> ${task.due}</span>`
      : "";
    const subtasksTag =
      subtasksCount > 0
        ? `<span class="task-tag subtasks-tag"><span class="icon">🗂️</span> ${subtasksCount} Subtasks</span>`
        : "";
    li.innerHTML = `
    <div class="task-main">
      <input type="checkbox" class="task-checkbox" ${
        task.completed ? "checked" : ""
      }/>
      <span class="task-title">${task.title}</span>
      <span class="task-arrow">&gt;</span>
    </div>
    <div class="task-tags">
      ${dateTag}
      ${subtasksTag}
      ${listTagHtml}
    </div>
  `;
    li.querySelector(".task-main").onclick = function (e) {
      if (e.target.classList.contains("task-checkbox")) return;
      if (page === "today" || page === "list") {
        openTask(task);
      } else {
        openUpcomingTask(task);
      }
    };
    li.querySelector(".task-checkbox").addEventListener("click", function (e) {
      e.stopPropagation();
      task.completed = this.checked;
      saveTasks();
      updateAllCounts();
      if (page === "list") {
        const pageTitle = document.getElementById("pageTitle");
        const listName = pageTitle ? pageTitle.textContent.trim() : "";
        renderListTasks(listName);
      } else {
        renderTasks();
      }
    });
    listElement.appendChild(li);
  }

  // --- Today and Upcoming Page Task Panels (Refactored) ---
  const taskDetailsPanel = document.getElementById("taskDetailsPanel");
  const upcomingTaskDetailsPanel = document.getElementById(
    "upcomingTaskDetailsPanel"
  );
  const taskTitle = document.getElementById("taskTitle");
  const taskDescription = document.getElementById("taskDescription");
  const taskListType = document.getElementById("taskListType");
  const taskDueDate = document.getElementById("taskDueDate");
  const saveBtn = document.getElementById("saveBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const addSubtaskBtn = document.getElementById("addSubtaskBtn");
  const subtasksUl = document.getElementById("subtasks");
  const closePanelBtn = document.getElementById("closePanelBtn");
  const saveUpcomingBtn = document.getElementById("saveUpcomingBtn");
  const deleteUpcomingBtn = document.getElementById("deleteUpcomingBtn");
  const addUpcomingSubtaskBtn = document.getElementById(
    "addUpcomingSubtaskBtn"
  );
  const upcomingSubtasksUl = document.getElementById("upcomingSubtasks"); // New: Reference for the Upcoming page's close button
  const closeUpcomingPanelBtn = document.getElementById(
    "closeUpcomingPanelBtn"
  );

  function openTask(task) {
    selectedTask = task;
    selectedListKey = task.list;
    if (!taskDetailsPanel) return;
    taskDetailsPanel.classList.add("open");
    taskTitle.value = task.title;
    taskDescription.value = task.description;
    taskListType.value = task.list;
    taskDueDate.value = task.due;
    renderSubtasks(task.subtasks, "today");
  }
  function openUpcomingTask(task) {
    selectedTask = task;
    selectedListKey = task.list;
    if (!upcomingTaskDetailsPanel) return;
    upcomingTaskDetailsPanel.classList.add("open");
    document.getElementById("upcomingTaskTitle").value = task.title;
    document.getElementById("upcomingTaskDescription").value =
      task.description || "";
    document.getElementById("upcomingTaskListType").value = task.list || "None";
    document.getElementById("upcomingTaskDueDate").value = task.due || "";
    renderSubtasks(task.subtasks, "upcoming");
  }

  function renderSubtasks(subtasks, page) {
    const ul = page === "today" ? subtasksUl : upcomingSubtasksUl;
    if (!ul) return;
    ul.innerHTML = "";
    if (subtasks) {
      subtasks.forEach((st) => {
        const li = document.createElement("li");
        li.innerHTML = `<input type="checkbox" ${
          st.completed ? "checked" : ""
        }/> <input type="text" value="${st.title}" />`;
        li.querySelector("input[type='checkbox']").addEventListener(
          "change",
          function () {
            st.completed = this.checked;
            saveTasks();
          }
        );
        li.querySelector("input[type='text']").addEventListener(
          "input",
          function () {
            st.title = this.value;
            saveTasks();
          }
        );
        ul.appendChild(li);
      });
    }
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", function () {
      if (!selectedTask) return;
      const oldList = selectedListKey;
      const newList = taskListType.value;
      selectedTask.title = taskTitle.value;
      selectedTask.description = taskDescription.value;
      selectedTask.due = taskDueDate.value;
      selectedTask.list = newList;
      if (oldList !== newList) {
        const oldTasks = allTasks[oldList];
        const oldIndex = oldTasks.indexOf(selectedTask);
        if (oldIndex > -1) oldTasks.splice(oldIndex, 1);
        allTasks[newList].push(selectedTask);
      }
      saveTasks();
      const listPageContainer = document.querySelector(".list-page-container");
      if (listPageContainer) {
        const pageTitle = document.getElementById("pageTitle");
        const listName = pageTitle ? pageTitle.textContent.trim() : "";
        renderListTasks(listName);
      } else {
        renderTasks();
      }
      taskDetailsPanel.classList.remove("open");
      updateAllCounts();
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", function () {
      if (!selectedTask) return;
      const listTasks = allTasks[selectedListKey];
      const indexInList = listTasks.indexOf(selectedTask);
      if (indexInList > -1) listTasks.splice(indexInList, 1);
      selectedTask = null;
      selectedListKey = null;
      saveTasks();
      const listPageContainer = document.querySelector(".list-page-container");
      if (listPageContainer) {
        const pageTitle = document.getElementById("pageTitle");
        const listName = pageTitle ? pageTitle.textContent.trim() : "";
        renderListTasks(listName);
      } else {
        renderTasks();
      }
      taskDetailsPanel.classList.remove("open");
      updateAllCounts();
    });
  }

  if (addSubtaskBtn) {
    addSubtaskBtn.addEventListener("click", function () {
      if (!selectedTask) return;
      if (!selectedTask.subtasks) selectedTask.subtasks = [];
      selectedTask.subtasks.push({ title: "Subtask", completed: false });
      renderSubtasks(selectedTask.subtasks, "today");
      saveTasks();
    });
  }

  if (saveUpcomingBtn) {
    saveUpcomingBtn.addEventListener("click", function () {
      if (!selectedTask) return;
      const oldList = selectedListKey;
      const newList = document.getElementById("upcomingTaskListType").value;
      selectedTask.title = document.getElementById("upcomingTaskTitle").value;
      selectedTask.description = document.getElementById(
        "upcomingTaskDescription"
      ).value;
      selectedTask.list = newList;
      selectedTask.due = document.getElementById("upcomingTaskDueDate").value;
      if (oldList !== newList) {
        const oldTasks = allTasks[oldList];
        const oldIndex = oldTasks.indexOf(selectedTask);
        if (oldIndex > -1) oldTasks.splice(oldIndex, 1);
        allTasks[newList].push(selectedTask);
      }
      saveTasks();
      renderTasks();
      upcomingTaskDetailsPanel.classList.remove("open");
      updateAllCounts();
    });
  }

  if (deleteUpcomingBtn) {
    deleteUpcomingBtn.addEventListener("click", function () {
      if (!selectedTask) return;
      const currentTasks = allTasks[selectedListKey];
      const taskIndex = currentTasks.indexOf(selectedTask);
      if (taskIndex > -1) currentTasks.splice(taskIndex, 1);
      saveTasks();
      renderTasks();
      upcomingTaskDetailsPanel.classList.remove("open");
      updateAllCounts();
    });
  }

  if (addUpcomingSubtaskBtn) {
    addUpcomingSubtaskBtn.addEventListener("click", function () {
      if (!selectedTask) return;
      if (!selectedTask.subtasks) selectedTask.subtasks = [];
      selectedTask.subtasks.push({ title: "Subtask", completed: false });
      renderSubtasks(selectedTask.subtasks, "upcoming");
      saveTasks();
    });
  }

  // --- Add Task Buttons Logic ---
  const addTaskBtn = document.getElementById("addTaskBtn");
  if (addTaskBtn) {
    addTaskBtn.addEventListener("click", function () {
      const newTask = {
        title: "New Task",
        description: "",
        list: "None",
        due: getTodayDate(),
        subtasks: [],
        completed: false,
      };
      allTasks.None.push(newTask);
      saveTasks();
      renderTasks();
      openTask(newTask);
      updateAllCounts();
    });
  }

  const addUpcomingBtns = [
    { btn: ".upcoming-group:nth-child(1) .add-task-main-btn", date: "today" },
    {
      btn: ".upcoming-group:nth-child(2) .add-task-main-btn",
      date: "tomorrow",
    },
    { btn: ".upcoming-group:nth-child(3) .add-task-main-btn", date: "week" },
  ];
  addUpcomingBtns.forEach(({ btn, date }) => {
    const button = document.querySelector(btn);
    if (button) {
      button.addEventListener("click", function () {
        let newDueDate = "";
        if (date === "today") newDueDate = getTodayDate();
        else if (date === "tomorrow") newDueDate = getTomorrowDate();
        else if (date === "week") newDueDate = getWeekFromNowDate();
        const newTask = {
          title: "New Task",
          description: "",
          list: "None",
          due: newDueDate,
          subtasks: [],
          completed: false,
        };
        allTasks.None.push(newTask);
        saveTasks();
        renderTasks();
        updateAllCounts();
      });
    }
  });

  // --- NEW: Add task button for list pages ---
  const addListTaskBtn = document.getElementById("addListTaskBtn");
  if (addListTaskBtn) {
    addListTaskBtn.addEventListener("click", function () {
      const pageTitle = document.getElementById("pageTitle");
      const listName = pageTitle ? pageTitle.textContent.trim() : "None";
      const newTask = {
        title: "New Task",
        description: "",
        list: listName,
        due: "",
        subtasks: [],
        completed: false,
      };
      if (!allTasks[listName]) allTasks[listName] = []; // Ensure the list exists
      allTasks[listName].push(newTask); // Save to the correct list
      saveTasks();
      renderListTasks(listName); // Render tasks for the specific list
      openTask(newTask); // Open the task details panel
      updateAllCounts(); // Update counts
    });
  }

  // --- Close Panel on Button Click ---
  if (closePanelBtn) {
    closePanelBtn.addEventListener("click", function () {
      if (taskDetailsPanel) {
        taskDetailsPanel.classList.remove("open");
      }
    });
  }
  if (closeUpcomingPanelBtn) {
    closeUpcomingPanelBtn.addEventListener("click", function () {
      if (upcomingTaskDetailsPanel) {
        upcomingTaskDetailsPanel.classList.remove("open");
      }
    });
  }

  // --- Close Panel on Outside Click ---
  document.body.addEventListener("click", function (e) {
    if (
      taskDetailsPanel &&
      taskDetailsPanel.classList.contains("open") &&
      !taskDetailsPanel.contains(e.target) &&
      !e.target.closest(".task-row")
    ) {
      taskDetailsPanel.classList.remove("open");
    }
    if (
      upcomingTaskDetailsPanel &&
      upcomingTaskDetailsPanel.classList.contains("open") &&
      !upcomingTaskDetailsPanel.contains(e.target) &&
      !e.target.closest(".task-row")
    ) {
      upcomingTaskDetailsPanel.classList.remove("open");
    }
  });

  // --- Initial Load and Render ---
  loadTasks();
  updateAllCounts();
  renderTasks();
});
