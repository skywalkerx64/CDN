(function () {
    const userAgent = navigator.userAgent || navigator.vendor;
    const isInAppBrowser = /FBAN|FBAV|Instagram|Telegram/i.test(userAgent);
    if (!isInAppBrowser) return;
  
    const config = {
      message: '🌐 Open this page in your browser for a better experience',
      backgroundColor: '#1E293B',
      textColor: '#FFFFFF',
      gifUrl: 'https://data.textstudio.com/output/sample/animated/3/2/6/5/public-1-5623.gif',
      trackingUrl: 'https://topbar.app/api/track',
    };
  
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background-color: ${config.backgroundColor};
      color: ${config.textColor};
      z-index: 9999;
      padding: 12px 16px;
      font-family: system-ui, sans-serif;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;
  
    const gif = document.createElement('img');
    gif.src = config.gifUrl;
    gif.style.cssText = `
      height: 40px;
      max-width: 100%;
      flex-shrink: 0;
    `;
  
    const text = document.createElement('div');
    text.textContent = config.message;
    text.style.cssText = `
      flex: 1 1 auto;
      font-size: 14px;
      line-height: 1.4;
      min-width: 200px;
    `;
  
    const button = document.createElement('button');
    button.textContent = 'Open in browser';
    button.style.cssText = `
      background: white;
      color: ${config.backgroundColor};
      padding: 6px 12px;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;
    `;
  
    button.onclick = () => {
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
    };
  
    container.append(gif, text, button);
    document.body.prepend(container);
    document.body.style.marginTop = '70px';
  })();
  