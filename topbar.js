(function () {
    const userAgent = navigator.userAgent || navigator.vendor;
  
    const isInAppBrowser =
      /FBAN|FBAV|Instagram|Telegram/i.test(userAgent);
  
    if (!isInAppBrowser) return;
  
    const config = {
      message: '🌐 Ouvrez dans votre navigateur pour une meilleure expérience',
      backgroundColor: '#1E293B',
      textColor: '#FFFFFF',
      gifUrl: 'https://data.textstudio.com/output/sample/animated/3/2/6/5/public-1-5623.gif',
      trackingUrl: 'https://xyztopbar.app/tracking',
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
      padding: 10px;
      font-family: sans-serif;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;
  
    const gif = document.createElement('img');
    gif.src = config.gifUrl;
    gif.style.height = '40px';
  
    const text = document.createElement('span');
    text.textContent = config.message;
    text.style.flex = '1';
  
    const button = document.createElement('button');
    button.textContent = 'Ouvrir dans le navigateur';
    button.style.cssText = `
      background: white;
      color: ${config.backgroundColor};
      padding: 6px 12px;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
    `;
  
    button.onclick = () => {
      fetch(config.trackingUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'click', timestamp: Date.now() }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      // Tentative d'ouverture via deep link ou fallback
      if (/android/i.test(userAgent)) {
        window.location = 'intent://' + location.href.replace(/^https?:\/\//, '') + '#Intent;scheme=https;package=com.android.chrome;end';
      } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
        window.location = 'x-web-search://?';
      } else {
        alert("Veuillez ouvrir cette page dans votre navigateur.");
      }
    };
  
    container.append(gif, text, button);
    document.body.prepend(container);
  
    // Décalage du body pour ne pas masquer le contenu
    document.body.style.marginTop = '60px';
  })();
  