(function () {
  function insertBackgroundIframe(url) {
    if (!url) return;

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
    // Detectar el script actual
    const currentScript = document.currentScript || (function () {
      const scripts = document.getElementsByTagName('script');
      return scripts[scripts.length - 1];
    })();

    const iframeUrl = currentScript?.getAttribute('data-url');

    applyTransparentBody();
    insertBackgroundIframe(iframeUrl);
  });
})();


/*

¡Perfecto! A continuación tienes una versión mejorada del script que permite al cliente configurar la URL del iframe directamente desde el atributo data-url en la etiqueta <script>.

⸻

✅ Paso 1: Código del archivo background-iframe.js

Guárdalo con este contenido:

(function () {
  function insertBackgroundIframe(url) {
    if (!url) return;

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
    // Detectar el script actual
    const currentScript = document.currentScript || (function () {
      const scripts = document.getElementsByTagName('script');
      return scripts[scripts.length - 1];
    })();

    const iframeUrl = currentScript?.getAttribute('data-url');

    applyTransparentBody();
    insertBackgroundIframe(iframeUrl);
  });
})();


⸻

✅ Paso 2: Instrucción para el cliente

El cliente solo tiene que copiar una línea como esta en su HTML:

<script 
  src="https://cdn.jsdelivr.net/gh/usuario/repositorio/background-iframe.js"
  data-url="https://real-julipichan-posidonia-shop.vercel.app/about">
</script>


⸻

✅ Ventajas
	•	Solo 1 línea de integración.
	•	Puedes actualizar tu script sin que el cliente cambie nada.
	•	Puedes usar diferentes fondos para diferentes clientes solo cambiando data-url.
	•	Puedes extenderlo en el futuro con más opciones como data-opacity, data-blur, etc.

⸻

¿Quieres que prepare también una versión minimizada (.min.js) y un README para que los clientes lo integren fácilmente como producto SaaS?

si: index12.js

*/