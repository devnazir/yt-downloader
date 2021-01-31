const inputURL = document.querySelector("input.url");
const btnDownload = document.querySelector(".btn-download");

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
    window.location.href = `http://localhost:8000/download?url=${url}`;
}