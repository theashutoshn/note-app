const supabase = window.supabase;

document.getElementById("logout-btn")?.addEventListener("click", async () => {
    await supabase.auth.signOut();
    location.href = "auth.html";
});

async function init() {
    // ✅ correct destructuring
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

    const userId = session.user.id;

    const list = document.getElementById("page-list");
    const titleInput = document.getElementById("new-page-title");

    async function createPage() {
        console.log("Create Page is clicked");
        const title = titleInput.value.trim();
        if (!title) return;

supabase-auth

        
dev

        // (optional) capture data for debugging
        const { data: insertData, error } = await supabase
            .from("notes")
            .insert({
                user_id: userId,
                title: title,
                content: "",
            }).select("page_key").single();


        console.log({ insertData, error });

        if (error) {
            console.log("Create Page Error", error);
            return;
        }
        console.log("Insert OK:", insertData);

        const pageKey = insertData.page_key;
        titleInput.value = "";
        await loadPages();
    }

    document
        .getElementById("add-page-btn")
        ?.addEventListener("click", createPage);

    async function loadPages() {
        list.innerHTML = "";

        const { data, error } = await supabase
            .from("notes")
            .select("page_key, title, updated_at, created_at")
            .eq("user_id", userId)
            .order("updated_at", { ascending: false })
            .order("created_at", { ascending: false, nullsFirst: false });

        if (error) {
            console.log("Fecting page error:", error);
            return;
        }

        for (const row of data || []) {
            const li = document.createElement("li");
            li.className = "page-item";

            const a = document.createElement("a");
            a.href = `page.html?page=${row.page_key}`;
            a.innerText = row.title || "Untitled";

            const delBtn = document.createElement("span");
            delBtn.className = "delete-btn";
            delBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
            delBtn.title = "Delete Page";
            delBtn.onclick = async () => {
                const { data: deleted, error: delErr } = await supabase
                    .from("notes")
                    .delete()
                    .eq("user_id", userId)
                    .eq("page_key", row.page_key).select();

                console.log({ deleted, delErr });
                if (delErr) {
                    console.log("Delete page error", delErr);
                    return;
                }
                li.remove();
            };

            li.appendChild(a);
            li.appendChild(delBtn);
            list.appendChild(li);
        }
    }

    await loadPages();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
    init();
}
