

- Crear proyecto react typescript con vite desde terminal

- Añadir librerias react-three-fiber y react-three-drei. Añadir un Canvas con un Box y OrbitControls como símbolo de hola mundo.
-- https://r3f.docs.pmnd.rs/getting-started/introduction
-- npm install three @types/three @react-three/fiber @react-three/drei

- Instalar libreria de fisicas phyjs y poner en componente ejemplo de vehicle physics.
-- https://lo-th.github.io/phy/docs/index.html#manual/Installation
-- npm install --save phy-engine
-- Option 1 _ Copy to public
Phy use worker so if you use compact option you have to
copy node_modules/phy-engine/compact/ to your /public folder
Or if you use non compact
copy node_modules/phy-engine/build/ to your /public folder
-- Option 2 _ add vite.config.js
create vite.config.js file on root with this code
import { defineConfig } from 'vite';
export default defineConfig({
  optimizeDeps: {
    exclude: ['phy-engine'],
  },
})
And on init use this setting
phy.init({ type:'HAVOK', worker:true, useLocal:true, useModule:true, scene:scene, callback:init });



- añadir use-cannon y crear avion sketchbook siguiendo el codigo original de sketchbook
-- https://github.com/pmndrs/use-cannon/blob/master/packages/react-three-cannon-examples/src/demos/demo-Heightfield.tsx


- Añadir pagina principal home para seleccionar apps

- Añadir App1 (videopoints visualizer), App2(carrousel products)...

- hacer gta fijandome en sketchbook pero creando mi propio motor de fisicas 
-- coche que sea una bola giratoria al principio como fisica. (usar rapier?) (usar varios motores de fisicas y dar la posibilidad de intercambiarlos con un PhysicsManager)

- poner fisicas de phyjs? xD

- Dentro de la carpeta components/ -> r3f/
- crear CameraControlsManager y que podamos controlar desde ahi si poner OrbitControls u otro tipo de controles

- arquitectura / estructura de carpetas

- dependencias: react, react-dom, ¿zustand?, (three, react-three-fiber... dependencias de threejs y graficos 3d y fisicas)
-- NO añadiremos router con react-router ni ninguna otra libreria, si hacemos router sera escrito por nosotros mismos usando la api de javascript.
-- NO gestionaremos el estado con redux, usaremos context de react y veremos la posibilidad de usar zustand seguramente. Y lo mismo ni usamos context de react y usamos solamente zustand seguramente xD.

- src/
 -- assets/
 -- apps/
  --- app1/
  ---- estructura proyecto react (components/, hooks/ ...) (libro react enterprise nextjs)
  ---- dentro de la carpeta components/ tendremos: dom/ y canvas/ indicando en dom componentes del dom como div, a... y en canvas/ componentes de react-three-fiber que irian dentro de <Canvas> de r3f.
  --- app2/
  ...
 -- shared/
 --- estructura proyecto react (compoenntes/, hooks/, utils/ ...) (libro react enterprise nextjs)