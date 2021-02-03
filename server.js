const express = require('express')
const app = express()
const fs = require('fs')
const ytdl = require('ytdl-core')
const fetch = require('node-fetch')
require('dotenv').config({ path: 'key.env' })

function renderHTML (req, res, path) {
  return fs.readFile(path, function (err, data) {
    if (err) return err
    res.end(data)
  })
}

app.use(express.static('public'))

app.get('/', function (req, res) {
  renderHTML(req, res, './views/index.html')
})

app.get('/download', async function (req, res) {
  try {
    const youtubeLink = req.query.url
    const info = await ytdl.getBasicInfo(youtubeLink)
    const title = info.player_response.videoDetails.title

    res.header('Content-Disposition', `attachment; filename="${title}.mp4"`)

    ytdl(youtubeLink, {
      format: 'mp4'
    }).pipe(res)
  } catch (err) {
    res.redirect('/')
  }
})

app.get('/search', async function (req, res) {
  const query = req.query.query
  const data = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&q=${query}&type=video&key=${process.env.APIKEY}`)
  resultSearchVideos(data, res)
})

async function resultSearchVideos (data, res) {
  const response = await data.json()
  res.json(response)
}

app.listen(process.env.PORT || 3000, () => console.log('Running at localhost:3000'))
