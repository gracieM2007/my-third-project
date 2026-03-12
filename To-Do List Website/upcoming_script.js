document.addEventListener("DOMContentLoaded", function () {
  const upcomingSections = document.querySelector(".upcoming-sections");
  const todayPageContainer = document.querySelector(".task-list");

  // --- Move shared resources to the top ---
  let allTasks = {
    Today: [],
    Personal: [],
    Work: [],
    "List 1": [],
    None: [],
  };

  let selectedTask = null;
  let selectedListKey = null;

  function saveTasks() {
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
  }

  function loadTasks() {
    const storedTasks = localStorage.getItem("allTasks");
    if (storedTasks) {
      allTasks = JSON.parse(storedTasks);
    }
  }

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

  // --- Unified function to update all counts ---
  function updateAllCounts() {
    const today = getTodayDate();
    const tomorrow = getTomorrowDate();
    const weekFromNow = getWeekFromNowDate();
    const allAppTasks = Object.values(allTasks).flat();

    const todayTasksCount = allAppTasks.filter(
      (task) => !task.due || task.due === today
    ).length;

    const upcomingTodayTasksCount = todayTasksCount;
    const upcomingTomorrowTasksCount = allAppTasks.filter(
      (task) => task.due === tomorrow
    ).length;
    const upcomingWeekTasksCount = allAppTasks.filter(
      (task) => task.due > tomorrow && task.due <= weekFromNow
    ).length;

    // The total upcoming tasks are all tasks with a due date of today or later.
    const upcomingTotal = allAppTasks.filter(
      (task) => !task.due || task.due >= today
    ).length;

    // Update Today page counts
    const todayPageTodayCount = document.getElementById("todayCount");
    const todayPageMainCount = document.getElementById("mainTaskCount");
    if (todayPageTodayCount) todayPageTodayCount.textContent = todayTasksCount;
    if (todayPageMainCount) todayPageMainCount.textContent = todayTasksCount;

    // Update Upcoming page counts
    const upcomingPageTodayCount =
      document.getElementById("upcomingTodayCount");
    const upcomingPageTomorrowCount = document.getElementById(
      "upcomingTomorrowCount"
    );
    const upcomingPageWeekCount = document.getElementById("upcomingWeekCount");
    const upcomingPageMainCount = document.getElementById("mainUpcomingCount");
    const sidebarUpcomingCount = document.getElementById("upcomingCount");

    if (upcomingPageTodayCount)
      upcomingPageTodayCount.textContent = upcomingTodayTasksCount;
    if (upcomingPageTomorrowCount)
      upcomingPageTomorrowCount.textContent = upcomingTomorrowTasksCount;
    if (upcomingPageWeekCount)
      upcomingPageWeekCount.textContent = upcomingWeekTasksCount;
    if (upcomingPageMainCount)
      upcomingPageMainCount.textContent = upcomingTotal;
    if (sidebarUpcomingCount) sidebarUpcomingCount.textContent = upcomingTotal;

    // Update other list counts
    if (document.getElementById("personalCount"))
      document.getElementById("personalCount").textContent =
        allTasks.Personal.length;
    if (document.getElementById("workCount"))
      document.getElementById("workCount").textContent = allTasks.Work.length;
    if (document.getElementById("list1Count"))
      document.getElementById("list1Count").textContent =
        allTasks["List 1"].length;
  }
  // --- End of shared section ---

  if (upcomingSections) {
    // --- UPCOMING PAGE LOGIC ---
    const upcomingTaskDetailsPanel = document.getElementById(
      "upcomingTaskDetailsPanel"
    );
    const upcomingTaskTitle = document.getElementById("upcomingTaskTitle");
    const upcomingTaskDescription = document.getElementById(
      "upcomingTaskDescription"
    );
    const upcomingTaskListType = document.getElementById(
      "upcomingTaskListType"
    );
    const upcomingTaskDueDate = document.getElementById("upcomingTaskDueDate");
    const saveUpcomingBtn = document.getElementById("saveUpcomingBtn");
    const deleteUpcomingBtn = document.getElementById("deleteUpcomingBtn");
    const addUpcomingSubtaskBtn = document.getElementById(
      "addUpcomingSubtaskBtn"
    );
    const upcomingSubtasksUl = document.getElementById("upcomingSubtasks");

    const closeUpcomingPanelBtn = document.getElementById(
      "closeUpcomingPanelBtn"
    );

    // New close button event listener
    closeUpcomingPanelBtn.addEventListener("click", function () {
      upcomingTaskDetailsPanel.classList.remove("open");
    });

    function renderUpcomingTasks() {
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

      document.getElementById("upcomingTodayTasks").innerHTML = "";
      document.getElementById("upcomingTomorrowTasks").innerHTML = "";
      document.getElementById("upcomingWeekTasks").innerHTML = "";

      const todayList = document.getElementById("upcomingTodayTasks");
      const tomorrowList = document.getElementById("upcomingTomorrowTasks");
      const weekList = document.getElementById("upcomingWeekTasks");

      upcomingTodayTasks.forEach((task) => renderTaskItem(task, todayList));
      upcomingTomorrowTasks.forEach((task) =>
        renderTaskItem(task, tomorrowList)
      );
      upcomingWeekTasks.forEach((task) => renderTaskItem(task, weekList));

      updateAllCounts(); // Call the unified function
    }

    function renderTaskItem(task, listElement) {
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
        openUpcomingTask(task);
      };
      li.querySelector(".task-checkbox").addEventListener(
        "click",
        function (e) {
          e.stopPropagation();
          task.completed = this.checked;
          saveTasks();
          updateAllCounts();
        }
      );
      listElement.appendChild(li);
    }

    function openUpcomingTask(task) {
      selectedTask = task;
      selectedListKey = task.list;
      upcomingTaskDetailsPanel.classList.add("open");
      upcomingTaskTitle.value = task.title;
      upcomingTaskDescription.value = task.description || "";
      upcomingTaskListType.value = task.list || "None";
      upcomingTaskDueDate.value = task.due || "";
      renderUpcomingSubtasks(task.subtasks || []);
    }

    function renderUpcomingSubtasks(subtasks) {
      upcomingSubtasksUl.innerHTML = "";
      subtasks.forEach((st) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <div class="subtask-row">
            <input type="checkbox" ${st.completed ? "checked" : ""}/>
            <input type="text" value="${st.title}" />
          </div>
        `;
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
        upcomingSubtasksUl.appendChild(li);
      });
    }

    addUpcomingSubtaskBtn.onclick = function () {
      if (!selectedTask) return;
      if (!selectedTask.subtasks) selectedTask.subtasks = [];
      selectedTask.subtasks.push({ title: "Subtask", completed: false });
      renderUpcomingSubtasks(selectedTask.subtasks);
      saveTasks();
    };

    saveUpcomingBtn.onclick = function () {
      if (!selectedTask) return;
      const oldList = selectedListKey;
      const newList = upcomingTaskListType.value;
      selectedTask.title = upcomingTaskTitle.value;
      selectedTask.description = upcomingTaskDescription.value;
      selectedTask.list = newList;
      selectedTask.due = upcomingTaskDueDate.value;

      if (oldList !== newList) {
        const oldTasks = allTasks[oldList];
        const oldIndex = oldTasks.indexOf(selectedTask);
        if (oldIndex > -1) oldTasks.splice(oldIndex, 1);
        allTasks[newList].push(selectedTask);
      }
      saveTasks();
      renderUpcomingTasks();
      upcomingTaskDetailsPanel.classList.remove("open");
    };

    deleteUpcomingBtn.onclick = function () {
      if (!selectedTask) return;
      const currentTasks = allTasks[selectedListKey];
      const taskIndex = currentTasks.indexOf(selectedTask);
      if (taskIndex > -1) currentTasks.splice(taskIndex, 1);
      saveTasks();
      renderUpcomingTasks();
      upcomingTaskDetailsPanel.classList.remove("open");
    };

    [
      { btn: ".upcoming-group:nth-child(1) .add-task-main-btn", date: "today" },
      {
        btn: ".upcoming-group:nth-child(2) .add-task-main-btn",
        date: "tomorrow",
      },
      { btn: ".upcoming-group:nth-child(3) .add-task-main-btn", date: "week" },
    ].forEach(({ btn, date }) => {
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
          renderUpcomingTasks();
        });
      }
    });

    document.body.addEventListener("click", function (e) {
      if (
        upcomingTaskDetailsPanel &&
        upcomingTaskDetailsPanel.classList.contains("open") &&
        !upcomingTaskDetailsPanel.contains(e.target) &&
        !e.target.closest(".task-row")
      ) {
        upcomingTaskDetailsPanel.classList.remove("open");
      }
    });

    loadTasks();
    renderUpcomingTasks();
  }
  // --- END OF UPCOMING PAGE LOGIC ---

  if (todayPageContainer) {
    // --- TODAY PAGE LOGIC ---
    const addTaskBtn = document.getElementById("addTaskBtn");
    const tasksUl = document.getElementById("tasks");
    const taskDetailsPanel = document.getElementById("taskDetailsPanel");
    const taskTitle = document.getElementById("taskTitle");
    const taskDescription = document.getElementById("taskDescription");
    const taskListType = document.getElementById("taskListType");
    const taskDueDate = document.getElementById("taskDueDate");
    const saveBtn = document.getElementById("saveBtn");
    const deleteBtn = document.getElementById("deleteBtn");
    const addSubtaskBtn = document.getElementById("addSubtaskBtn");
    const subtasksUl = document.getElementById("subtasks");
    const closePanelBtn = document.getElementById("closePanelBtn");

    function renderTodayTasks() {
      if (!tasksUl) return;
      tasksUl.innerHTML = "";
      const today = getTodayDate();

      const todayTasks = Object.values(allTasks)
        .flat()
        .filter((task) => !task.due || task.due === today);

      todayTasks.forEach((task) => {
        const li = document.createElement("li");
        li.className = "task-row";
        let listTagHtml = "";
        if (task.list && task.list !== "None") {
          let colorClass = "";
          if (task.list === "Personal") colorClass = "pink-badge";
          if (task.list === "Work") colorClass = "blue-badge";
          if (task.list === "List 1") colorClass = "yellow-badge";
          listTagHtml = `<span class="task-tag list-tag ${colorClass}">${task.list}</span>`;
        }

        const subtasksCount = task.subtasks ? task.subtasks.length : 0;
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
            ${listTagHtml}
            ${subtasksTag}
          </div>
        `;
        li.querySelector(".task-main").onclick = function (e) {
          if (e.target.tagName.toLowerCase() === "input") return;
          openTodayTask(task);
        };
        li.querySelector(".task-checkbox").addEventListener(
          "click",
          function (e) {
            e.stopPropagation();
            task.completed = this.checked;
            saveTasks();
            updateAllCounts();
          }
        );
        tasksUl.appendChild(li);
      });
      updateAllCounts(); // Call the unified function
    }

    function openTodayTask(task) {
      selectedTask = task;
      selectedListKey = task.list;
      if (!taskDetailsPanel) return;
      taskDetailsPanel.classList.add("open");
      taskTitle.value = task.title;
      taskDescription.value = task.description;
      taskListType.value = task.list;
      taskDueDate.value = task.due;
      renderTodaySubtasks(task.subtasks);
    }

    function renderTodaySubtasks(subtasks) {
      if (!subtasksUl) return;
      subtasksUl.innerHTML = "";
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
          subtasksUl.appendChild(li);
        });
      }
    }

    addTaskBtn.addEventListener("click", function () {
      const newTask = {
        title: "New Task",
        description: "",
        list: "Personal",
        due: getTodayDate(),
        subtasks: [],
        completed: false,
      };
      allTasks.Personal.push(newTask);
      saveTasks();
      renderTodayTasks();
      openTodayTask(newTask);
    });

    closePanelBtn.addEventListener("click", function () {
      taskDetailsPanel.classList.remove("open");
      selectedTask = null;
      selectedListKey = null;
    });

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
      renderTodayTasks();
      taskDetailsPanel.classList.remove("open");
    });

    deleteBtn.addEventListener("click", function () {
      if (!selectedTask) return;
      const listTasks = allTasks[selectedListKey];
      const indexInList = listTasks.indexOf(selectedTask);
      if (indexInList > -1) listTasks.splice(indexInList, 1);
      selectedTask = null;
      selectedListKey = null;
      saveTasks();
      renderTodayTasks();
      taskDetailsPanel.classList.remove("open");
    });

    addSubtaskBtn.addEventListener("click", function () {
      if (!selectedTask) return;
      if (!selectedTask.subtasks) selectedTask.subtasks = [];
      selectedTask.subtasks.push({ title: "Subtask", completed: false });
      renderTodaySubtasks(selectedTask.subtasks);
      saveTasks();
    });

    document.body.addEventListener("click", function (e) {
      if (
        taskDetailsPanel &&
        taskDetailsPanel.classList.contains("open") &&
        !taskDetailsPanel.contains(e.target) &&
        !e.target.closest(".task-row")
      ) {
        taskDetailsPanel.classList.remove("open");
      }
    });

    loadTasks();
    renderTodayTasks();
  }
});
