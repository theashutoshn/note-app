document.addEventListener("DOMContentLoaded", () => {

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

});