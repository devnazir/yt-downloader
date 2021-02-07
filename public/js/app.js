const inputURL = document.querySelector('input.url')
const btnDownload = document.querySelectorAll('.btn-download')

let onScroll = false
let resultFirstSearch = 16
let scrollLeftTitle = null
let onMouseDown = false
let startX = 0

function clickedBtnDownload (e) {
  const url = inputURL.value
  if (e.target.classList.contains('video')) {
    downloadVideo(url)
  } else if (e.target.classList.contains('mp3')) {
    downloadAudio(url)
  }
}

inputURL.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const url = inputURL.value
    console.log(url.length)
    downloadVideo(url)
  }
})

function downloadVideo (url) {
  if (url) {
    window.location.href = `${window.location.origin}/download?url=${url}`
    return
  }

  alert('Please insert your Video URL')
}

function downloadAudio (url) {
  if (url) {
    window.location.href = `${window.location.origin}/mp3?url=${url}`
    return
  }

  alert('Please insert your Video URL')
}

function showInputButton (imgSearch) {
  const inputSearch = imgSearch.previousElementSibling
  inputSearch.classList.add('open-input-search')
  imgSearch.classList.add('hide-img-search')

  inputSearch.focus()
  inputSearch.addEventListener('focusout', () => {
    imgSearch.classList.remove('hide-img-search')
    inputSearch.classList.remove('open-input-search')
    inputSearch.value = ''
  })

  inputSearch.addEventListener('keydown', searchVideos)
}

function searchVideos (e) {
  if (e.key === 'Enter') {
    const valueSearch = this.value
    resultSearchVideos(valueSearch)
  }
}

async function resultSearchVideos (value, count) {
  try {
    hideHeaderWrapper()
    const result = count ?? resultFirstSearch
    const data = await fetch(`${window.location.origin}/search?query=${value}&result=${result}`, {
      method: 'GET'
    })
    getVideos(data)
    document.body.style.overflowY = 'auto'

    if (!onScroll) {
      window.addEventListener('scroll', () => {
        const { scrollHeight, scrollTop, clientHeight } = document.documentElement
        if (scrollTop + clientHeight >= scrollHeight) {
          onScroll = true
          resultFirstSearch += 8
          resultSearchVideos(value, resultFirstSearch)
          moreVideos()
        }
      })
    }
  } catch (err) {
    console.log(err)
  }
}

function moreVideos () {
  const elDots = document.querySelector('.more-videos')
  const dots = Array.from(document.querySelector('.more-videos').innerHTML)
  const dot = dots.map((dot, i) => {
    return `<span class="dot-${i + 1}">${dot}</span>`
  }).join('').toString()

  elDots.innerHTML = dot
}

function hideHeaderWrapper () {
  const header = document.querySelector('header')
  const headerWrapper = header.querySelector('.header-wrapper')
  header.classList.add('change-height')
  headerWrapper.style.display = 'none'
}

async function getVideos (response) {
  try {
    const data = await response.json()
    const items = data.items
    showVideos(items)
  } catch (err) {
    console.log(err)
  }
}

function showVideos (videos) {
  let cards = ''
  videos.forEach(video => {
    cards += componentResult(video)
  })

  const resultSearch = document.querySelector('.result-search')
  resultSearch.innerHTML = cards

  const nextPage = document.createElement('button')
  nextPage.textContent = '...'
  nextPage.setAttribute('class', 'more-videos')
  resultSearch.append(nextPage)

  scrollingTitle()
}

function scrollingTitle () {
  const everyTitle = document.querySelectorAll('.title-wrap .title')
  everyTitle.forEach(title => {
    title.addEventListener('mousedown', mouseDown)
    title.addEventListener('mousemove', mouseMove)
    title.addEventListener('mouseup', mouseUp)
    title.addEventListener('mouseleave', mouseUp)
  })
}

function mouseDown (e) {
  e.preventDefault()
  onMouseDown = true
  startX = e.clientX
  scrollLeftTitle = this.parentElement.scrollLeft
}

function mouseMove (e) {
  e.preventDefault()
  const moveX = e.clientX
  if (!onMouseDown) return
  const onScroll = moveX - startX
  this.parentElement.scrollLeft = scrollLeftTitle - onScroll
}

function mouseUp (e) {
  onMouseDown = false
}

function getDataClickedVideo (id) {
  downloadVideo(`https://www.youtube.com/watch?v=${id}`)
}

function componentResult (video) {
  return `<div class="card">
            <div class="thumbnail">
              <img src="${video.snippet.thumbnails.medium.url}" alt="">
            </div>
            <div class="title-wrap">
              <div class="title">${video.snippet.title}</div>
            </div>
            <div class="choose-btn">
              <button class="download-video" data-id=${video.id.videoId}>mp4</button>
              <button class="download-audio" data-id=${video.id.videoId}>mp3</button>
            </div>
          </div>`
}

document.addEventListener('click', event => {
  if (event.target.className === 'img-search') {
    showInputButton(event.target)
  } else if (event.target.className === 'download-video') {
    getDataClickedVideo(event.target.dataset.id)
  }
})

btnDownload.forEach(button => button.addEventListener('click', clickedBtnDownload))
