const express = require("express");
const app = express();
const fs = require("fs");
const url = require("url");
const qs = require("qs");
const ytdl = require("ytdl-core");
const fetch = require('node-fetch');

function renderHTML(req, res, path) {
    return fs.readFile(path, function (err, data) {
        if(err) return err;
        res.end(data);
    });
}

app.use(express.static("public"));

app.get("/", function (req, res) {
    renderHTML(req, res, "./views/index.html");
});

app.get("/download", async function (req, res) {
    try {
        const URL = url.parse(req.url).query;
        const query = qs.parse(URL)
        const youtubeLink = query.url;

        const info = await ytdl.getBasicInfo(youtubeLink);
        const title = info.player_response.videoDetails.title;
        console.log(info)

        res.header(`Content-Disposition`, `attachment; filename="${title}.mp4"`);

        ytdl(youtubeLink, {
            format: "mp4",
        }).pipe(res);

    } catch (err) {
        res.redirect("/");
    }
});

app.get("/search", function (req, res) {
    renderHTML(req, res, "./views/index.html");
});

app.listen(process.env.PORT || 3000, () => console.log(`Running`));
