document.addEventListener("DOMContentLoaded", () => {
    const showAllNotesBtn = document.getElementById("showAllNotes");
    const noteSidebar = document.getElementById("note-sidebar");
    const closeSidebarBtn = document.getElementById("close-sidebar");
    const notesList = document.getElementById("notes-list");

    const titleNew = document.getElementById("note-title");
    const paraNew = document.getElementById("note-para");



    const urlParams = new URLSearchParams(window.location.search);
    const pageKey = urlParams.get("page");
    if (pageKey) {
        const data = JSON.parse(localStorage.getItem(pageKey));
        if (data) {
            titleNew.innerText = data.title;
            paraNew.innerText = data.content;
        }
    }



    // save written data
    function saveData() {
        const updateDate = {
            title: titleNew.innerText.trim(),
            heading: titleNew.innerText.trim(),
            content: paraNew.innerText.trim()
        };

        localStorage.setItem(pageKey, JSON.stringify(updateDate));

    }

    titleNew.addEventListener("blur", saveData);
    paraNew.addEventListener("blur", saveData);

    showAllNotesBtn.addEventListener("click", () => {

        const isOpen = noteSidebar.classList.contains("active"); //using .contains to check if the element has the "active" class name. For using the same button to open and close sidebar

        if (isOpen) {
            noteSidebar.classList.remove("active");
        } else {
            noteSidebar.classList.add("active");
            renderNotesList();
        }

    });

    closeSidebarBtn.addEventListener("click", () => {
        noteSidebar.classList.remove("active");
    });


    function renderNotesList() {
        notesList.innerHTML = "";

        for (let i = 1; i <= localStorage.getItem("pageCount"); i++) {
            const pageKey = `page-${i}`;
            const noteData = JSON.parse(localStorage.getItem(pageKey));

            if (noteData) {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.textContent = noteData.title || noteData.heading;
                a.href = `page.html?page=${pageKey}`;

                const delBtn = document.createElement("span");
                delBtn.className = "delete-btn";
                delBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
                delBtn.title = "Delete Page";
                delBtn.onclick = () => {
                    localStorage.removeItem(pageKey);
                    li.remove();
                };

                li.appendChild(a);
                li.appendChild(delBtn);
                notesList.appendChild(li);
            }

        }
    }






});


// Timer function

let duration = 15 * 60;
let timer = duration;
let interval = null;
let isRunning = false;

function updateTimer() {

    let minutes = parseInt(timer / 60, 10);
    let seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    document.getElementById("timer").textContent = minutes + ":" + seconds;
}

function startTimer() {

    if (isRunning) {
        clearInterval(interval);
        isRunning = false;
    } else {

        interval = setInterval(() => {
            if (timer <= 0) {
                resetTimer();
                return;
            }

            timer--;
            updateTimer();
        }, 1000);
        isRunning = true;
    }
}

function resetTimer() {
    clearInterval(interval);
    isRunning = false;
    timer = duration;
    updateTimer();
}

updateTimer();

// Timer function