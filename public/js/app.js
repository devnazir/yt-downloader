const inputURL = document.querySelector("input.url");
const btnDownload = document.querySelector(".btn-download");
const imgSearch = document.querySelector(".img-search");

btnDownload.addEventListener("click", () => {
    const url = inputURL.value;
    downloadVideo(url)
});

inputURL.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        const url = inputURL.value;
        downloadVideo(url)
    }
});

function downloadVideo(url) {
    window.location.href = `${window.location.origin}/download?url=${url}`;
}

// Reminder myself
// Don't forget to Refactor
imgSearch.addEventListener("click", function () {
    const inputSearch = this.previousElementSibling;
    inputSearch.classList.add("open-input-search");
    this.classList.add("hide-img-search");

    inputSearch.focus();
    inputSearch.addEventListener("focusout", () => {
        this.classList.remove("hide-img-search");
        inputSearch.classList.remove("open-input-search")
    });

    inputSearch.addEventListener("keydown", searchVideos)
});

function searchVideos(e) {
    if (e.key == "Enter") {
        const valueSearch = this.value;
        resultSearchVideos(valueSearch);
    }
}

async function resultSearchVideos(value) {
    const headerWrapper = document.querySelector(".header-wrapper");
    headerWrapper.style.display = "none";

    if (history.pushState) {
        document.title = "Result Search";
        window.history.pushState(null, '', `/search?query=${value}`);
    } 

    const data = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${value}&type=video&key=AIzaSyDv8wAkRENMnAXnAqx4QsUs8ufDokXTXt0`);

    showVideos(data);
}

async function showVideos(response) {
    const data = await response.json();
    const items = data.items;

    console.log(items)
}

if(document.title === "Youtube Downloader") {
    window.history.pushState(null, '', `/`);
}