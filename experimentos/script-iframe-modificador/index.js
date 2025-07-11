// Crear el iframe
const iframe = document.createElement('iframe');
iframe.src = 'https://ultimate-react-three-espinaco.vercel.app/';
iframe.style.position = 'fixed';
iframe.style.top = '0';
iframe.style.left = '0';
iframe.style.width = '100vw';
iframe.style.height = '100vh';
iframe.style.border = 'none';
iframe.style.zIndex = '-1'; // Lo manda al fondo

// Estilos al body para fondo
document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.overflow = 'hidden';
document.body.style.background = 'transparent';

// Añadir iframe al body
document.body.appendChild(iframe);