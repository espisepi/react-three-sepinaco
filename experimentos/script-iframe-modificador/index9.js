(function () {
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

  // Ejecutar después de que toda la página se haya cargado
  window.addEventListener('load', () => {
    applyTransparentBody();
    const iframeUrl = 'https://real-julipichan-posidonia-shop.vercel.app/about';
    insertBackgroundIframe(iframeUrl);
  });
})();

/*

Perfecto. A continuación tienes el script empaquetado como un snippet seguro, usando una función autoejecutable anónima (IIFE). Esto evita conflictos con otras variables globales y permite copiar y pegar el código en cualquier página:

⸻

✅ Snippet seguro, aislado y listo para pegar en cualquier web

(function () {
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

  // Ejecutar después de que toda la página se haya cargado
  window.addEventListener('load', () => {
    applyTransparentBody();
    const iframeUrl = 'https://real-julipichan-posidonia-shop.vercel.app/about';
    insertBackgroundIframe(iframeUrl);
  });
})();


⸻

✅ Ventajas de este formato:
	•	Seguro: no contamina el scope global.
	•	Encapsulado: puedes reutilizarlo sin que interfiera con el código de la web.
	•	Portable: puedes usarlo en un <script> directo, en una extensión, en GTM, etc.

¿Quieres ahora que ese script cargue desde un CDN y puedas actualizarlo sin tocar la página del cliente? También puedo ayudarte a empaquetarlo como archivo JS externo.

si: index10.js

*/