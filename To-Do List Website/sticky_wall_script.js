// This script handles the functionality of the sticky notes.
document.addEventListener("DOMContentLoaded", function () {
  const stickyWall = document.getElementById("stickyWall");
  const addNoteBtn = document.getElementById("addNote");
  const colorPalette = document.querySelector(".color-palette");
  let selectedColor = "yellow";

  function makeEditable(element, placeholder) {
    element.contentEditable = true;
    element.innerText = placeholder;
    element.classList.add("placeholder");

    element.addEventListener("focus", function () {
      if (element.innerText === placeholder) {
        element.innerText = "";
        element.classList.remove("placeholder");
      }
    });

    element.addEventListener("blur", function () {
      if (element.innerText.trim() === "") {
        element.innerText = placeholder;
        element.classList.add("placeholder");
      }
    });
  }

  colorPalette.addEventListener("click", function (event) {
    const clickedSwatch = event.target.closest(".color-swatch");
    if (clickedSwatch) {
      const swatches = colorPalette.querySelectorAll(".color-swatch");
      swatches.forEach((swatch) => swatch.classList.remove("selected"));
      clickedSwatch.classList.add("selected");
      selectedColor = clickedSwatch.getAttribute("data-color");
    }
  });

  addNoteBtn.addEventListener("click", function () {
    const newNote = document.createElement("div");
    newNote.classList.add("note", selectedColor);

    // --- DELETE BUTTON ---
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "×"; // X symbol
    deleteBtn.classList.add("delete-btn1");
    deleteBtn.addEventListener("click", function () {
      newNote.remove(); // Remove this note from DOM
    });

    // Create title
    const title = document.createElement("h3");
    makeEditable(title, "New Task");

    // Create list
    const list = document.createElement("ul");
    const firstListItem = document.createElement("li");
    firstListItem.contentEditable = true;
    firstListItem.classList.add("new-point");
    list.appendChild(firstListItem);

    list.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        const newListItem = document.createElement("li");
        newListItem.contentEditable = true;
        newListItem.classList.add("new-point");
        list.insertBefore(newListItem, event.target.nextSibling);
        newListItem.focus();
      }
    });

    // Append everything to the note
    newNote.appendChild(deleteBtn);
    newNote.appendChild(title);
    newNote.appendChild(list);

    // Insert note into wall
    stickyWall.insertBefore(newNote, addNoteBtn);

    firstListItem.focus();
  });
});
