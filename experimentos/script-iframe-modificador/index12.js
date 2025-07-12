

!function(){function e(e){if(!e)return;const t=`<iframe class="background-iframe" src="${e}" allowfullscreen loading="lazy"></iframe>`;document.body.insertAdjacentHTML("beforeend",t);const n=document.createElement("style");n.innerHTML="iframe.background-iframe{position:fixed;top:0;left:0;width:100vw;height:100vh;border:none;z-index:-1;pointer-events:none}",document.head.appendChild(n)}function t(){document.body.classList.add("transparent-body");const e=document.createElement("style");e.innerHTML="*{background:transparent!important;background-filter:none!important}body.transparent-body{margin:0;padding:0;overflow:hidden;background:transparent}",document.head.appendChild(e)}window.addEventListener("load",(()=>{const n=document.currentScript||(function(){const e=document.getElementsByTagName("script");return e[e.length-1]})(),r=n?.getAttribute("data-url");t(),e(r)}))}();


/*

¡Genial! Vamos a empaquetarlo como un producto listo para vender o distribuir.

⸻

✅ 1. Versión minimizada (background-iframe.min.js)

Aquí tienes el código minimizado del script anterior (sin comentarios, todo en una línea):

!function(){function e(e){if(!e)return;const t=`<iframe class="background-iframe" src="${e}" allowfullscreen loading="lazy"></iframe>`;document.body.insertAdjacentHTML("beforeend",t);const n=document.createElement("style");n.innerHTML="iframe.background-iframe{position:fixed;top:0;left:0;width:100vw;height:100vh;border:none;z-index:-1;pointer-events:none}",document.head.appendChild(n)}function t(){document.body.classList.add("transparent-body");const e=document.createElement("style");e.innerHTML="*{background:transparent!important;background-filter:none!important}body.transparent-body{margin:0;padding:0;overflow:hidden;background:transparent}",document.head.appendChild(e)}window.addEventListener("load",(()=>{const n=document.currentScript||(function(){const e=document.getElementsByTagName("script");return e[e.length-1]})(),r=n?.getAttribute("data-url");t(),e(r)}))}();

Puedes subir este archivo como background-iframe.min.js a:
	•	GitHub (y usarlo vía jsDelivr o un CDN propio)
	•	Vercel, Netlify, tu servidor o bucket de Cloudflare / S3

⸻

✅ 2. Instrucción para el cliente (README.md)

Puedes ofrecerlo con un archivo README.md o incluir estas instrucciones en tu web comercial o landing:

⸻

🖼️ background-iframe.js

Convierte cualquier página en un lienzo con un fondo animado o personalizado cargado por iframe.

✅ Cómo usarlo
	1.	Pega este script en tu página web:

<script 
  src="https://cdn.jsdelivr.net/gh/usuario/repositorio/background-iframe.min.js"
  data-url="https://miweb.com/fondo">
</script>

	2.	¡Y listo! Tu fondo se mostrará debajo de todo tu contenido sin afectar los clics ni el rendimiento.

⸻

🎯 Opciones

Atributo	Tipo	Descripción
data-url	string	URL que se cargará en el fondo como iframe


⸻

🛡️ Seguro y aislado
	•	El script no contamina el entorno global.
	•	El iframe no intercepta clics ni interacciones.
	•	Compatible con cualquier CMS, incluyendo WordPress, Shopify, Wix, Webflow…

⸻

✅ 3. Siguiente paso: marca, marketing y escalabilidad

Si lo vas a vender:
	•	Crea una landing page con demo integrada (puedo ayudarte a montarla).
	•	Ofrécelo como parte de un servicio: puedes cobrar por alojar los fondos (Vercel o Cloudflare Pages), personalizarlos, o integrarlos en webs de clientes.
	•	Agrega más opciones: data-opacity, data-blur, data-darken, etc.

⸻

¿Quieres que te genere ahora una landing de ejemplo con una demo y botón “copiar script”? ¿O te preparo una versión NPM del mismo paquete para proyectos más avanzados?

si: index13.js

*/