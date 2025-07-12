function insertBackgroundIframe(url) {
  // Crear el iframe como string
  const iframeHTML = `
    <iframe
      class="background-iframe"
      src="${url}"
      allowfullscreen
      loading="lazy"
    ></iframe>
  `;
  document.body.insertAdjacentHTML('beforeend', iframeHTML);

  // Estilos específicos del iframe
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
  // Añadir clase al body
  document.body.classList.add('transparent-body');

  // Estilos del body y globales
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

// Ejecutar todo después de que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Aplicar estilos primero
  applyTransparentBody();

  // Insertar el iframe de fondo después
  const iframeUrl = 'https://real-julipichan-posidonia-shop.vercel.app/about';
  insertBackgroundIframe(iframeUrl);
});

/*
⸻

🧠 Notas:
	•	DOMContentLoaded es suficiente en la mayoría de los casos (más rápido que esperar a window.onload, que espera también imágenes, iframes y estilos externos).
	•	El orden se mantiene: primero se aplican los estilos del body, y después se inserta el iframe, para evitar el parpadeo.

¿Quieres una versión que espere incluso a window.onload si necesitas asegurarte de que también imágenes e iframes de la página original han terminado de cargar?

si: index8.js

*/