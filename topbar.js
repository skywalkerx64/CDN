(function () {
    const userAgent = navigator.userAgent || navigator.vendor;
    const isInAppBrowser = /FBAN|FBAV|Instagram|Telegram/i.test(userAgent);
    if (!isInAppBrowser) return;
  
    const config = {
      message: '🌐 Open this page in your browser for a better experience',
      backgroundColor: '#1E293B',
      textColor: '#FFFFFF',
      gifUrl: 'https://example.com/guide.gif',
      trackingUrl: 'https://topbar.app/api/track',
    };
  
    const container = document.createElement('a');
    container.href = '#';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background-color: ${config.backgroundColor};
      color: ${config.textColor};
      z-index: 9999;
      font-family: system-ui, sans-serif;
      display: flex;
      align-items: center;
      text-decoration: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      height: auto;
      min-height: 60px;
      padding: 8px 12px;
    `;
  
    const gifWrapper = document.createElement('div');
    gifWrapper.style.cssText = `
      flex: 0 0 20%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-right: 8px;
    `;
  
    const gif = document.createElement('img');
    gif.src = config.gifUrl;
    gif.alt = 'Guide';
    gif.style.cssText = `
      height: 40px;
      max-width: 100%;
      object-fit: contain;
    `;
    gifWrapper.appendChild(gif);
  
    const textWrapper = document.createElement('div');
    textWrapper.style.cssText = `
      flex: 1;
      font-size: 14px;
      line-height: 1.4;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    `;
  
    const text = document.createElement('span');
    text.textContent = config.message;
    text.style.cssText = `
      display: inline-block;
      width: 100%;
      color: ${config.textColor};
    `;
    textWrapper.appendChild(text);
  
    container.appendChild(gifWrapper);
    container.appendChild(textWrapper);
  
    container.addEventListener('click', (e) => {
      e.preventDefault();
  
      fetch(config.trackingUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'click', timestamp: Date.now() }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (/android/i.test(userAgent)) {
        window.location = 'intent://' + location.href.replace(/^https?:\/\//, '') + '#Intent;scheme=https;package=com.android.chrome;end';
      } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
        window.location = 'x-web-search://?';
      } else {
        alert("Please open this page in your browser.");
      }
    });
  
    document.body.prepend(container);
  
    setTimeout(() => {
      document.body.style.marginTop = container.offsetHeight + 'px';
    }, 100);
  })();
  