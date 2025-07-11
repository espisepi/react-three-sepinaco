// Crear el iframe como fondo
const iframe = document.createElement('iframe');
iframe.src = 'https://real-julipichan-posidonia-shop.vercel.app/about';
iframe.className = 'background-iframe'; // Añadir clase al iframe

// Añadir clase al body
document.body.classList.add('transparent-body');

// Estilos globales, body y iframe en el style
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
document.head.appendChild(style);

// Insertar el iframe al body
document.body.appendChild(iframe);