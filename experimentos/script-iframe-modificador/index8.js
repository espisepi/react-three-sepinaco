function insertBackgroundIframe(url) {
  const iframeHTML = `
    <iframe
      class="background-iframe"
      src="${url}"
      allowfullscreen
      loading="lazy"
    ></iframe>
  `;
  document.body.insertAdjacentHTML('beforeend', iframeHTML);

  const style = document.createElement('style');
  style.innerHTML = `
    iframe.background-iframe {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      border: none;
      z-index: -1;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
}

function applyTransparentBody() {
  document.body.classList.add('transparent-body');

  const style = document.createElement('style');
  style.innerHTML = `
    * {
      background: transparent !important;
      backdrop-filter: none !important;
    }

    body.transparent-body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: transparent;
    }
  `;
  document.head.appendChild(style);
}

// Esperar a que todo el contenido de la página esté cargado
window.addEventListener('load', () => {
  applyTransparentBody();
  const iframeUrl = 'https://real-julipichan-posidonia-shop.vercel.app/about';
  insertBackgroundIframe(iframeUrl);
});

/*

⸻

🧠 Diferencias clave:

Evento	Cuándo se dispara	Velocidad	Cuándo usarlo

DOMContentLoaded	Cuando el HTML está parseado	Más rápido	Para manipulación temprana del DOM

load	Cuando todo (HTML, imágenes, iframes) carga	Más lento	Para asegurar que no haya parpadeos visuales ni conflictos de carga


⸻

¿Quieres que el script también funcione como un “snippet” que puedas pegar en cualquier web sin conflicto de variables (por ejemplo, encerrado en una función autoejecutable)?

si: index9.js

*/