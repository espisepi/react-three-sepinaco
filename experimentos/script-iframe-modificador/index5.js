// Definir la URL del iframe
const iframeUrl = 'https://real-julipichan-posidonia-shop.vercel.app/about';

// Añadir clase al body
document.body.classList.add('transparent-body');

// Crear el HTML del iframe dinámicamente
const iframeHTML = `
  <iframe
    class="background-iframe"
    src="${iframeUrl}"
    allowfullscreen
    loading="lazy"
  ></iframe>
`;

// Insertar el iframe en el body
document.body.insertAdjacentHTML('beforeend', iframeHTML);

// Estilos globales y del iframe
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

// Insertar los estilos en el head
document.head.appendChild(style);