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

// Ejecutar todas las funciones

// Aplicar background transparente a todos los elementos html y body
applyTransparentBody();

// Insertar iframe como elemento de fondo de la pagina (position: fixed; z-index: -1;) (fondo background estatico)
const iframeUrl = 'https://real-julipichan-posidonia-shop.vercel.app/about';
insertBackgroundIframe(iframeUrl);



/**
 
Si ejecutas las funciones en este orden:

// Insertar iframe como elemento de fondo de la pagina (position: fixed; z-index: -1;) (fondo background estatico)
const iframeUrl = 'https://real-julipichan-posidonia-shop.vercel.app/about';
insertBackgroundIframe(iframeUrl);

// Aplicar background transparente a todos los elementos html y body
applyTransparentBody();

✅ El script seguirá funcionando correctamente, pero:

⸻

⚠️ El iframe puede mostrarse mal durante un breve instante (flicker visual)

Por qué:
	•	insertBackgroundIframe() añade el <iframe> al body inmediatamente.
	•	En ese momento, el body todavía no tiene la clase transparent-body, ni se han aplicado los estilos globales * { background: transparent !important; }.
	•	Eso significa que:
	•	El fondo del <body> puede ser blanco u opaco por defecto.
	•	Otros elementos de la página podrían tener fondo por defecto también.
	•	Al cargar el iframe antes de aplicar estilos globales, podría mostrarse tapado o no como fondo limpio durante unos milisegundos.

⸻

🧠 Conclusión
	•	Funciona: no rompe nada.
	•	Pero puede generar un parpadeo visual o una carga no deseada del fondo opaco antes de que los estilos se apliquen.
	•	Por eso es mejor llamar primero a applyTransparentBody() y luego a insertBackgroundIframe(...):

applyTransparentBody();
insertBackgroundIframe(iframeUrl);

Eso asegura que los estilos ya están en el DOM antes de que el iframe aparezca, evitando flashes blancos o inconsistencias visuales.

¿Quieres que todo se ejecute tras el DOMContentLoaded para asegurar que no se aplique antes de tiempo?


 */