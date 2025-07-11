// Crear el iframe como fondo
const iframe = document.createElement('iframe');
iframe.src = 'https://real-julipichan-posidonia-shop.vercel.app/about';
iframe.style.position = 'fixed';
iframe.style.top = '0';
iframe.style.left = '0';
iframe.style.width = '100vw';
iframe.style.height = '100vh';
iframe.style.border = 'none';
iframe.style.zIndex = '-1';
iframe.style.pointerEvents = 'none'; // Para que no interfiera con clics si hay contenido encima

// Estilos del body
document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.overflow = 'hidden';
document.body.style.background = 'transparent';

// Aplicar fondo transparente a todos los elementos de la página
const style = document.createElement('style');
style.innerHTML = `
  * {
    background: transparent !important;
    backdrop-filter: none !important;
  }
`;
document.head.appendChild(style);

// Insertar el iframe al body
document.body.appendChild(iframe);