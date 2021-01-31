const express = require("express");
const app = express();
const fs = require("fs");
const url = require("url");
const qs = require("qs");
const ytdl = require("ytdl-core");

app.use(express.static("public"));

app.get("/", function (req, res) {
    fs.readFile("./views/index.html", function (err, data) {
        res.end(data);
    });
});

app.get("/download", async function (req, res) {
    try {
        const URL = url.parse(req.url).query;
        const query = qs.parse(URL)
        const youtubeLink = query.url;

        const info = await ytdl.getBasicInfo(youtubeLink);
        const title = info.player_response.videoDetails.title;

        res.header('Content-type', 'text/html');
        res.header(`Content-Disposition`, `attachment; filename="${title}.mp4"`);

        ytdl(youtubeLink, {
            format: "mp4",
        }).pipe(res);

    } catch (err) {
        res.redirect("/");
    }
});

app.listen(process.env.PORT || 3000, () => console.log("Running"));