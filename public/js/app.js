const inputURL = document.querySelector('input.url')
const btnDownload = document.querySelector('.btn-download')

let onScroll = false
let resultFirstSearch = 8

btnDownload.addEventListener('click', () => {
  const url = inputURL.value
  downloadVideo(url)
})

inputURL.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const url = inputURL.value
    downloadVideo(url)
  }
})

function downloadVideo (url) {
  window.location.href = `${window.location.origin}/download?url=${url}`
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
    const result = count ?? 8
    const data = await fetch(`${window.location.origin}/search?query=${value}&result=${result}`, {
      method: 'GET'
    })
    getVideos(data)
    document.body.style.overflowY = 'scroll'

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
}

function getDataClickedVideo (id) {
  downloadVideo(`https://www.youtube.com/watch?v=${id}`)
}

function componentResult (video) {
  return `<div class="card">
            <div class="thumbnail">
              <img src="${video.snippet.thumbnails.medium.url}" alt="">
            </div>
            <div class="title">${video.snippet.title}</div>
            <button class="download-video" data-id=${video.id.videoId}>Download</button>
          </div>`
}

document.addEventListener('click', event => {
  if (event.target.className === 'img-search') {
    showInputButton(event.target)
  } else if (event.target.className === 'download-video') {
    getDataClickedVideo(event.target.dataset.id)
  }
})
