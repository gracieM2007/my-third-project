# 📝 Advanced To-Do List Web Application

A feature-rich, responsive personal task management web application built with HTML5, CSS3, and modern Vanilla JavaScript. Features a sidebar navigation system, interactive calendar, sticky notes wall, custom project/personal task lists, subtask tracking, and local storage persistence.

---

## 🌟 Key Features

- ☀️ **Today View**: Track tasks due today with real-time sidebar task counts.
- 📅 **Upcoming Tasks**: Grouped views for Today, Tomorrow, and This Week tasks.
- 🗓️ **Interactive Calendar**: View and schedule tasks by Day, Week, or Month view.
- 📝 **Sticky Wall**: Create colorful digital sticky notes (Yellow, Blue, Pink, Orange).
- 🏷️ **Task Lists & Categories**: Organize tasks under Personal, Work, or Custom Lists.
- 📋 **Subtask & Detail Panel**: Add descriptions, due dates, times, tags, and subtasks to any item.
- 💾 **Local Storage Persistence**: All tasks, events, and counts persist automatically across browser refreshes.

---

## 📁 Directory Structure

```text
To-Do List Website/
├── index.html              # Main entry point (redirects to today.html)
├── today.html              # Today tasks dashboard view
├── upcoming.html           # Upcoming tasks view (Today, Tomorrow, This Week)
├── calender.html           # Calendar view (Month / Week / Day view)
├── sticky_wall.html        # Interactive sticky notes wall
├── personal.html           # Personal task list page
├── work.html               # Work task list page
├── List1.html              # Custom list 1 page
├── README.md               # Project documentation
│
├── css/                    # Stylesheets directory
│   ├── style.css           # General application base styles
│   ├── style2.css          # Alternate layout styles
│   ├── style3.css          # Main app theme & layout (Calendar / Upcoming / Sticky Wall)
│   ├── today.css           # Today & List pages styling
│   └── Lists.css           # Custom list component styling
│
├── js/                     # JavaScript logic modules
│   ├── script.js           # Basic task list script
│   ├── script3.js          # Core app controller & sidebar manager
│   ├── calender_script.js  # Interactive calendar controller (Day/Week/Month view)
│   ├── calender2.js        # Extended calendar helper logic
│   ├── upcoming_script.js  # Upcoming tasks controller
│   ├── sticky_wall_script.js # Sticky wall notes controller
│   └── P,W,L1.js           # List-specific task controller
│
└── assets/                 # Static media assets
    └── images/             # Decorative & theme images (.jpg, .png)
        ├── bow.jpg, bow.png, bow2.jpg
        ├── bunny.jpg, butterfly.jpg
        ├── cutu.jpg, cutu2.jpg
        ├── daisy.jpg, dolphin.jpg
        ├── flo.jpg, flower.jpg, flower.png
        ├── star.jpg, teddy.jpg
```

---

## 🚀 How to Run

1. Clone or download the repository to your local computer.
2. Open [`index.html`](file:///c:/Users/DELL/OneDrive/Desktop/To-Do%20List%20Website/index.html) or [`today.html`](file:///c:/Users/DELL/OneDrive/Desktop/To-Do%20List%20Website/today.html) in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
3. Alternatively, launch with **VS Code Live Server** extension for live reloading.

---

## 🛠️ Built With

- **HTML5**: Semantic web structure
- **CSS3**: Custom CSS variables, flexbox, grid layouts, micro-animations
- **Vanilla JavaScript (ES6+)**: DOM manipulation, event delegation, LocalStorage API
