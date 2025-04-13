document.addEventListener("DOMContentLoaded", () => {
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
            content: "Loreum Ipsum"
        };
        localStorage.setItem(pageKey, JSON.stringify(pageData));

        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `page.html?page=${pageKey}`;
        a.innerText = title;
        li.appendChild(a);
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
            const a = document.createElement("a");
            a.href = `page.html?page=${key}`;
            a.innerText = data.title;
            li.appendChild(a);
            list.appendChild(li);
        }
    }




    // function deleteAllPages() {
    //     localStorage.removeItem("pageData");
    // }

    // window.deleteAllPages = deleteAllPages;

});
