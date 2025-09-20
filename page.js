document.addEventListener("DOMContentLoaded", () => {
    const supabase = window.supabase;

    const showAllNotesBtn = document.getElementById("showAllNotes");
    const noteSidebar = document.getElementById("note-sidebar");
    const closeSidebarBtn = document.getElementById("close-sidebar");
    const notesList = document.getElementById("notes-list");

    const titleNew = document.getElementById("note-title");
    const paraNew = document.getElementById("note-para");



    document.getElementById("logout-btn")?.addEventListener("click", async () => {
        await supabase.auth.signOut();
        location.href = "auth.html";
    });

    const urlParams = new URLSearchParams(window.location.search);
    const pageKey = urlParams.get("page");

    let userId = null;

    async function loadNotes() {
        const {
            data: { session },
            error: sessErr,
        } = await supabase.auth.getSession();

        if (sessErr) {
            console.log(sessErr);
            return;
        }

        // ✅ check session (not "no error")
        if (!session) {
            // auth-gate should redirect; bail out
            return;
        }

        userId = session.user.id;

        if (!pageKey) return;

        const { data, error } = await supabase.from("notes").select("title, content").eq("user_id", userId).eq("page_key", pageKey).maybeSingle();

        if (error) {
            console.error("Fetch note error:", error);
            return;
        }

        titleNew.innerText = data?.title || "";
        paraNew.innerText = data?.content || "";

    }

    // save written data
    async function saveData() {

        if (!pageKey || !userId) return;



        const updateData = {
            user_id: userId,
            page_key: pageKey,
            title: titleNew.innerText.trim(),
            content: paraNew.innerText.trim()
        };

        try {
            const { data, error } = await supabase.from("notes").upsert(updateData, { onConflict: 'user_id, page_key' });

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

    showAllNotesBtn.addEventListener("click", async () => {

        const isOpen = noteSidebar.classList.contains("active"); //using .contains to check if the element has the "active" class name. For using the same button to open and close sidebar

        if (isOpen) {
            noteSidebar.classList.remove("active");
        } else {
            noteSidebar.classList.add("active");
            await renderNotesList();
        }

    });

    closeSidebarBtn.addEventListener("click", () => {
        noteSidebar.classList.remove("active");
    });


    async function renderNotesList() {
        notesList.innerHTML = "";

        if (!userId) {
            const {
                data: { session },
            } = await window.supabase.auth.getSession();
            if (!session) return;
            userId = session.user.id;
        }

        const { data, error } = await supabase.from("notes").select("page_key, title, updated_at, created_at").eq("user_id", userId).order("updated_at", { ascending: false }).order("created_at", { ascending: false, nullFirst: false });

        if (error) {
            console.error("Fetch list error:", error);
            return;
        }

        for (const row of data || []) {

            const li = document.createElement("li");
            const a = document.createElement("a");
            li.className = "page-item";
            a.innerText = row.title || "Untitled";
            a.href = `page.html?page=${row.page_key}`;

            //delete page
            const delBtn = document.createElement("span");
            delBtn.className = "delete-btn";
            delBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
            delBtn.title = "Delete Page";
            delBtn.onclick = async () => {
                const { error: delErr } = await supabase.from("notes").delete().eq("user_id", userId).eq("page_key", row.page_key);

                if (delErr) {
                    console.log("Delete page error", delErr);
                    return;
                }
                li.remove();
            };

            li.appendChild(a);
            li.appendChild(delBtn);
            notesList.appendChild(li);
        }
    }



    loadNotes();

    document.getElementById("timer")?.addEventListener("click", startTimer);
    document.getElementById("timer")?.addEventListener("dblclick", resetTimer);




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