
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const getSupabase = () =>
    window.supabase ??
    (window.supabase = createClient("https://zanjbmsolrqdaikwzzpl.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphbmpibXNvbHJxZGFpa3d6enBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwOTQ5MzEsImV4cCI6MjA3MzY3MDkzMX0.pBd3ArobSnWvCGOuGUEguQe5xz4O-g_gC4Ip-QocbPg"));

document.getElementById("logout-btn")?.addEventListener("click", async () => {
    await getSupabase().auth.signOut();
    location.href = "auth.html";
});


function init() {
    window.supabase = createClient("https://zanjbmsolrqdaikwzzpl.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphbmpibXNvbHJxZGFpa3d6enBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwOTQ5MzEsImV4cCI6MjA3MzY3MDkzMX0.pBd3ArobSnWvCGOuGUEguQe5xz4O-g_gC4Ip-QocbPg");



    let pageCount = localStorage.getItem("pageCount") || 0;

    function createPage() {
        const titleInput = document.getElementById("new-page-title");
        const title = titleInput.value.trim();
        if (!title) return;

        pageCount++;
        localStorage.setItem("pageCount", pageCount);

        const pageKey = `page-${pageCount}`;
        const pageData = {
            title: title,
            heading: title,
            content: ""
        };
        localStorage.setItem(pageKey, JSON.stringify(pageData));

        const li = document.createElement("li");
        li.className = "page-item";
        const a = document.createElement("a");
        a.href = `page.html?page=${pageKey}`;
        a.innerText = title;


        //delete page
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
        document.getElementById("page-list").appendChild(li);

        titleInput.value = "";
    }

    // This makes the function accessible from HTML
    window.createPage = createPage;

    // Load existing pages on refresh
    const list = document.getElementById("page-list");
    for (let i = 1; i <= pageCount; i++) {
        const key = `page-${i}`;
        const data = JSON.parse(localStorage.getItem(key));
        if (data) {
            const li = document.createElement("li");
            li.className = "page-item";
            const a = document.createElement("a");
            a.href = `page.html?page=${key}`;
            a.innerText = data.title;

            //delete page
            const delBtn = document.createElement("span");
            delBtn.className = "delete-btn";
            delBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
            delBtn.title = "Delete Page";
            delBtn.onclick = () => {
                localStorage.removeItem(key);
                li.remove();
            };


            li.appendChild(a);
            li.appendChild(delBtn);
            list.appendChild(li);
        }
    }




    // function deleteAllPages() {
    //     localStorage.removeItem("pageData");
    // }

    // window.deleteAllPages = deleteAllPages;


}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
    init();
}


