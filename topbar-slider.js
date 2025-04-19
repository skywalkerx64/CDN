;(function () {
    const userAgent = navigator.userAgent || navigator.vendor
    const isInAppBrowser = /FBAN|FBAV|Instagram|Telegram/i.test(userAgent)
    if (!isInAppBrowser) return
  
    const apiBaseUrl = 'https://topbar.jeupix.com/api'
    const scriptTag = document.currentScript
    const urlParams = new URLSearchParams(scriptTag.src.split('?')[1])
    const configId = urlParams.get('id')
  
    if (!configId) return console.error('[TopBar] Missing config ID in script tag')
  
    const apiUrl = `${apiBaseUrl}/links/${configId}`

    fetch(apiBaseUrl + '/track/link/' + configId, {
        method: 'POST',
        body: JSON.stringify({ action: 'visit', timestamp: Date.now(), userAgent, url: location.href }),
        headers: { 'Content-Type': 'application/json' },
      })

    fetch(apiUrl)
      .then((res) => res.json())
      .then((config) => {
        const messages = config.messages?.data || [] // tableau [{ text, gif }]
        if (!messages.length) return
  
        // Création du conteneur principal
        const container = document.createElement('a')
        container.href = '#'
        container.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background-color: ${config.backgroundColor || '#000'};
          color: ${config.textColor || '#fff'};
          z-index: 9999;
          font-family: system-ui, sans-serif;
          text-decoration: none;
          overflow: hidden;
          height: 40px;
          display: flex;
          align-items: center;
        `
  
        // Carrousel wrapper
        const carousel = document.createElement('div')
        carousel.style.cssText = `
          display: flex;
          transition: transform 0.5s ease-in-out;
          height: 100%;
          width: ${messages.length * 100}%;
        `
  
        messages.forEach((msg) => {
          const slide = document.createElement('div')
          slide.style.cssText = `
            flex: 0 0 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 0 8px;
            box-sizing: border-box;
            height: 100%;
          `
  
          const span = document.createElement('span')
          span.textContent = msg.message
          span.style.cssText = 'font-size: 14px; line-height: 1.4;'
          slide.appendChild(span)

          if (msg.gifUrl) {
            const gif = document.createElement('img')
            gif.src = msg.gifUrl
            gif.alt = ''
            gif.style.cssText = `
              height: 40px;
              width: 40px;
              object-fit: contain;
            `
            slide.appendChild(gif)
          }
  
          carousel.appendChild(slide)
        })
  
        container.appendChild(carousel)
        document.body.prepend(container)
  
        // Décalage automatique du carrousel
        let currentIndex = 0
        setInterval(() => {
          currentIndex = (currentIndex + 1) % messages.length
          carousel.style.transform = `translateX(-${currentIndex * 100}%)`
        }, 4000)
  
        // Décaler le contenu de la page pour ne pas masquer le haut
        setTimeout(() => {
          document.body.style.marginTop = container.offsetHeight + 'px'
        }, 100)
  
        // Clic sur la top bar = tracking + redirection
        container.addEventListener('click', (e) => {
          e.preventDefault()
  
          fetch(apiBaseUrl + '/track/link/' + configId, {
            method: 'POST',
            body: JSON.stringify({ action: 'click', timestamp: Date.now(), userAgent, url: location.href }),
            headers: { 'Content-Type': 'application/json' },
          })
  
          if (/android/i.test(userAgent)) {
            window.location = 'intent://' + location.href.replace(/^https?:\/\//, '') + '#Intent;scheme=https;package=com.android.chrome;end'
          } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
            window.location = 'x-web-search://?'
          } else {
            alert('Please open this page in your browser.')
          }
        })
      })
      .catch((err) => {
        console.error('[TopBar] Failed to fetch config:', err)
      })
  })()
  