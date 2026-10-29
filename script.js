//console.log("hello")
const noteInput = document.getElementById("noteInput");
const pinnedNotes = document.getElementById("pinnedNotes");
const otherNotes = document.getElementById("otherNotes");
const searchInput = document.getElementById("searchInput");
const sidebarItems = document.querySelectorAll(".sidebar-menu li");

console.log(noteInput);
console.log(pinnedNotes);
console.log(otherNotes);

let notes = JSON.parse(localStorage.getItem("myNotes")) || [];

noteInput.addEventListener("keypress", function(event) {
    if   (event.key === "Enter") {
        let newNote = {
            id: Date.now(),
            text: noteInput.value,
            trashed: false,
            pinned: false,
            completed: false
        };
    
    notes.push(newNote);
    noteInput.value="";
    console.log(notes); 
    renderNotes();
    };   
});

function renderNotes() {
  localStorage.setItem("myNotes", JSON.stringify(notes));  
  otherNotes.innerHTML = "";
   pinnedNotes.innerHTML = ""

  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    if (currentView === "trash" && note.trashed !== true) {
    continue;
  }
    if (currentView !== "trash" && note.trashed === true) {
    continue;
  }

    let card = document.createElement("div");
    card.classList.add("note-card");
    card.setAttribute("data-id", note.id);

    let text = document.createElement("p");
    text.innerText = note.text;
    text.setAttribute("contenteditable", "true");

    if (note.completed) {
    text.style.textDecoration = "line-through";
    text.style.opacity = "0.6";
  }
    text.setAttribute("contenteditable", "false");

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";

    let pinBtn = document.createElement("button");
    pinBtn.innerText = "Pin";

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = note.completed;

    let editBtn = document.createElement("button");
    editBtn.innerText = "Edit";

    card.appendChild(editBtn);
    card.appendChild(checkbox);
    card.appendChild(text);
    card.appendChild(deleteBtn);
    card.appendChild(pinBtn);
    //otherNotes.appendChild(card);

     if (note.pinned === true) {
      pinnedNotes.appendChild(card);
    } else {
      otherNotes.appendChild(card);
    }
  }
}
//DELETING PART
function handleNoteClick(event) {
  if (event.target.tagName === "BUTTON") {
    let card = event.target.parentElement;
    let noteId = card.getAttribute("data-id");
    
    let note = notes.find(function(note) {
      return note.id === Number(noteId);
    });

     if (event.target.innerText === "Delete") {
    note.trashed = true;
     }

     if (event.target.innerText === "Pin") {
    note.pinned = true;
    }
    if (event.target.innerText === "Edit") {
    console.log("Edit button clicked"); 
    let textElement = card.querySelector("p");
    textElement.setAttribute("contenteditable", "true");
    textElement.focus();
    return;
}
  } 
  if (event.target.type === "checkbox") {
    let card = event.target.parentElement;
    let noteId = card.getAttribute("data-id");

    let note = notes.find(function(note) {
      return note.id === Number(noteId);
    });

    note.completed = event.target.checked;
  }

    renderNotes();
  }
  otherNotes.addEventListener("click", handleNoteClick);
  pinnedNotes.addEventListener("click", handleNoteClick);

let currentView = "notes";

sidebarItems.forEach(function(item) {
  item.addEventListener("click", function() {
    currentView = item.getAttribute("data-view");
    renderNotes();
  });
});

otherNotes.addEventListener("blur", function(event) {
  if (event.target.tagName === "P") {
    let card = event.target.parentElement;
    let noteId = card.getAttribute("data-id");

    let note = notes.find(function(note) {
      return note.id === Number(noteId);
    });

    note.text = event.target.innerText;
  }
}, true);

searchInput.addEventListener("input", function() {
  let searchText = searchInput.value.toLowerCase();

  let allCards = otherNotes.querySelectorAll(".note-card");

  for (let i = 0; i < allCards.length; i++) {
    let card = allCards[i];
    let cardText = card.innerText.toLowerCase();

    if (cardText.includes(searchText)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  }
});

renderNotes();

