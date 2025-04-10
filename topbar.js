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
  
    // Create clickable wrapper
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
      padding: 12px 16px;
      font-family: system-ui, sans-serif;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-decoration: none;
    `;
  
    // Add GIF
    const gif = document.createElement('img');
    gif.src = config.gifUrl;
    gif.style.cssText = `
      height: 40px;
      max-width: 100%;
      flex-shrink: 0;
    `;
  
    // Add message
    const text = document.createElement('div');
    text.textContent = config.message;
    text.style.cssText = `
      flex: 1 1 auto;
      font-size: 14px;
      line-height: 1.4;
      min-width: 200px;
    `;
  
    container.append(gif, text);
  
    // Click handler on full bar
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
  
    // Adjust body margin to avoid hiding site's navbar
    setTimeout(() => {
      const barHeight = container.offsetHeight;
      document.body.style.marginTop = barHeight + 'px';
    }, 100);
  })();
  