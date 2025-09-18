import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

document.addEventListener("DOMContentLoaded", () => {
    const showAllNotesBtn = document.getElementById("showAllNotes");
    const noteSidebar = document.getElementById("note-sidebar");
    const closeSidebarBtn = document.getElementById("close-sidebar");
    const notesList = document.getElementById("notes-list");

    const titleNew = document.getElementById("note-title");
    const paraNew = document.getElementById("note-para");

    window.supabase = createClient("https://zanjbmsolrqdaikwzzpl.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphbmpibXNvbHJxZGFpa3d6enBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwOTQ5MzEsImV4cCI6MjA3MzY3MDkzMX0.pBd3ArobSnWvCGOuGUEguQe5xz4O-g_gC4Ip-QocbPg");

    document.getElementById("logout-btn")?.addEventListener("click", async () => {
        await window.supabase.auth.signOut();
        location.href = "auth.html";
    });

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
    async function saveData() {
        const updateDate = {
            title: titleNew.innerText.trim(),
            heading: titleNew.innerText.trim(),
            content: paraNew.innerText.trim()
        };

        localStorage.setItem(pageKey, JSON.stringify(updateDate));

        try {
            const { data, error } = await window.supabase.from("notes").upsert({ page_key: pageKey, title: updateDate.title, content: updateDate.content }, { onConflict: "page_key" });

            if (error) {
                console.error("Supabase upsert error", error);
            } else {
                console.log("Saved to Supabase:", data)
            }
        } catch (e) {
            console.error("Unexpected error saving to Supabase:", e);
        }
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

    document.querySelector('.toolbar').addEventListener('click', (e) => {
        if (e.target.closest('button')) {
            const style = e.target.closest('button').dataset.style;
            applyStyle(style);
        }
    });

    function applyStyle(style) {
        const selection = window.getSelection();

        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (!range.collapsed && isSelectionInsideEditable(selection)) {
                const span = document.createElement('span');

                switch (style) {
                    case 'bold':
                        span.style.fontWeight = 'bold';
                        break;
                    case 'italic':
                        span.style.fontStyle = 'italic';
                        break;
                    case 'underline':
                        span.style.textDecoration = 'underline';
                        break;
                    default:
                        break;
                }
                span.appendChild(range.extractContents());
                range.insertNode(span);
            }
        }
    }

    function isSelectionInsideEditable(selection) {
        let node = selection.anchorNode;
        while (node) {
            if (node.nodeType === Node.ELEMENT_NODE && node.getAttribute('contenteditable') === 'true') {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }


    saveData();

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