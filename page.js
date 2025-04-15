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