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

  window.addEventListener('load', () => {
    applyTransparentBody();
    const iframeUrl = 'https://real-julipichan-posidonia-shop.vercel.app/about';
    insertBackgroundIframe(iframeUrl);
  });
})();

/*

Perfecto. Te explico cómo hacerlo paso a paso para que puedas vender o distribuir tu script como un producto tipo SaaS, actualizable desde un CDN (o tu propio servidor), con solo una línea que el cliente pega en su web.

⸻

✅ 1. Crea tu archivo JS externo

Guarda tu snippet como archivo JS, por ejemplo:

background-iframe.js

Contenido:

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

  window.addEventListener('load', () => {
    applyTransparentBody();
    const iframeUrl = 'https://real-julipichan-posidonia-shop.vercel.app/about';
    insertBackgroundIframe(iframeUrl);
  });
})();


⸻

✅ 2. Sube el archivo a un CDN

Opciones:
	•	GitHub + jsDelivr (gratis y rápido):
	1.	Sube el archivo a un repo público de GitHub.
	2.	Usa una URL como:

https://cdn.jsdelivr.net/gh/usuario/repositorio@versión/background-iframe.js


	•	Vercel / Netlify: ideal si ya usas estos servicios.
	•	Tu propio hosting/CDN: por ejemplo:

https://tudominio.com/assets/background-iframe.js



⸻

✅ 3. El cliente solo necesita insertar esta línea

<script src="https://cdn.jsdelivr.net/gh/usuario/repositorio@versión/background-iframe.js"></script>

Y listo. Con esto:
	•	El cliente no necesita copiar código.
	•	Tú puedes actualizar el script en GitHub o en tu servidor, y se reflejará automáticamente (si no usas versiones fijas en la URL).

⸻

¿Quieres permitir que el cliente defina su propia URL de iframe?

Te puedo generar una versión más avanzada que acepte data-attributes como:

<script 
  src="https://cdn.jsdelivr.net/gh/usuario/repositorio/background-iframe.js"
  data-url="https://miweb.com/fondo"
></script>

¿Te interesa esa versión configurable también?

si: index11.js

*/