const express = require('express')
const app = express()
const fs = require('fs')
const ytdl = require('ytdl-core')
const fetch = require('node-fetch')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
require('dotenv').config({ path: 'key.env' })

function renderHTML (res, path) {
  return fs.readFile(path, function (err, data) {
    if (err) return err
    res.end(data)
  })
}

function htmlDOM (path, callback) {
  fs.readFile(path, function (err, data) {
    if (err) return err
    callback(data.toString())
  })
}

function errorFile (res, html) {
  fs.writeFile('./views/error.html', html, function (err) {
    if (err) return err
    renderHTML(res, './views/error.html')
  })
}

app.use(express.static('public'))

app.get('/', function (req, res) {
  renderHTML(res, './views/index.html')
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
    htmlDOM('./views/index.html', function (data) {
      const { document } = new JSDOM(`${data}`).window
      const errorText = document.body.querySelector('span.error-text')
      errorText.textContent = `Sorry.. video url ${req.query.url} not found, please check your video url`
      const html = document.documentElement.outerHTML

      errorFile(res, html)
    })
  }
})

app.get('/mp3', async function (req, res) {
  try {
    const youtubeLink = req.query.url
    const info = await ytdl.getBasicInfo(youtubeLink)
    const title = info.player_response.videoDetails.title

    res.header('Content-Disposition', `attachment; filename="${title}.mp3"`)

    ytdl(youtubeLink, {
      format: 'mp3',
      filter: 'audioonly'
    }).pipe(res)
  } catch (err) {
    htmlDOM('./views/index.html', function (data) {
      const { document } = new JSDOM(`${data}`).window
      const errorText = document.body.querySelector('span.error-text')
      errorText.textContent = `Sorry.. video url ${req.query.url} not found, please check your video url`
      const html = document.documentElement.outerHTML

      errorFile(res, html)
    })
  }
})

app.get('/search', async function (req, res) {
  try {
    const query = req.query.query
    const maxResult = req.query.result
    const data = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResult}&q=${query}&type=video&key=${process.env.APIKEY}`)

    resultSearchVideos(data, res)
  } catch (err) {
    console.log(err)
  }
})

async function resultSearchVideos (data, res) {
  try {
    const response = await data.json()
    res.json(response)
  } catch (err) {
    console.log(err)
  }
}

app.listen(process.env.PORT || 3000, () => console.log('Running at localhost:3000'))
