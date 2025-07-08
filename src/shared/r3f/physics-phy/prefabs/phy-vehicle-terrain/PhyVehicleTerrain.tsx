import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import { phy, math } from "phy-engine";

import { Controller } from "../../../../../phy/src/3TH/Controller";




function PhyVehicleTerrain() {
    const { scene, gl: renderer, camera } = useThree();

    useEffect(() => {
        if (!phy || typeof phy.init !== "function") {
            console.error(
                "Phy.js no está correctamente importado o no tiene init().",
            );
            return;
        }
        if (!renderer) return;



        const debug = 0;
        let buggy = null;

        const tm = { now: 0, delta: 0, then: 0, inter: 1000 / 60, tmp: 0, n: 0, dt: 0, fps: 0 }
        let controls = null;

        phy.init({
            type: "PHYSX",
            worker: true,
            compact: true,
            scene: scene,
            renderer: renderer,
            callback: physicsReady,
        });

        function physicsReady() {

            phy.set({ substep: 2, gravity: [0, -9.81, 0], key: true });

            phy.add({
                type: "plane",
                name: "floor",
                size: [300, 1, 300],
                visible: false,
            });

            const maps = [
                "textures/buggy/body_c.jpg",
                "textures/buggy/extra_c.jpg",
                "textures/buggy/extra_n.jpg",
                "textures/buggy/pilote_c.jpg",
                "textures/buggy/wheel_c.jpg",
                "textures/buggy/wheel_n.jpg",
                "textures/buggy/suspension_c.jpg",
            ];

            phy.load(["/models/buggy.glb", ...maps], onComplete, "./assets/");
        }

        const onComplete = () => {
            phy.applyMorph("buggy", null, true);

            const model = phy.getMesh("buggy");
            applyMaterial(model);

            const body = model["h_chassis"];
            const wheel = model["h_wheel"];
            const suspension = model["h_susp_base"];
            const brake = model["h_brake"];

            buggy = phy.add({
                type: "vehicle",
                name: "buggy",
                ray: debug,
                debug: debug,
                radius: 0.43,
                deep: 0.3,
                wPos: [0.838, 0.43, 1.37],
                chassisPos: [0, 0, 0],
                massCenter: [0, 0, 0],
                chassisShape: model["h_shape"],
                meshScale: 100,
                chassisMesh: body,
                wheelMesh: wheel,
                brakeMesh: brake,
                suspensionMesh: suspension,
                maxSteering: 14,
                s_travel: 0.4,
            });

            // add lights car
            const lightCar = new THREE.SpotLight(new THREE.Color("red"), 1.0);
            lightCar.position.set(0.0, 1.0, 0.0);
            buggy.add(lightCar);

            let wtop = wheel.clone();
            wtop.position.set(0, 0.0125, -0.0113);
            wtop.rotation.z = -90 * math.torad;
            buggy.model.add(wtop);

            if (debug) return;

            terrainTest();

            // update after physic step
            phy.setPostUpdate(update);

            // phy.follow("buggy", { direct: true, simple: true, decal: [0, 1, 0] });
            // phy.control("buggy");

            // Asegurar que el vehículo está listo antes de seguirlo
            setTimeout(() => {
                if (buggy) {
                    const followGroup = new THREE.Group();
                    followGroup.name = 'followGroup';
                    scene.add(followGroup);
                    // Asignar el controlador de cámara
                    controls = new Controller(camera, renderer.domElement, followGroup);
                    controls.resetAll();
                    controls.startFollow(buggy, {
                        direct: true,
                        simple: true,
                        decal: [0, 1, 0],
                    });
                    phy.setControl(controls);
                    phy.follow("buggy", { direct: true, simple: true, decal: [0, 1, 0] });
                    phy.control("buggy");
                }
            }, 500);
        };

        const terrainTest = () => {
            let terrain = phy.add({
                type: "terrain",
                name: "terra",
                friction: 0.5,
                restitution: 0.0,
                uv: 128,
                pos: [0, -5, 0],
                size: [512, 20, 512],
                sample: [512, 512],
                frequency: [0.016, 0.05, 0.2],
                level: [1, 0.2, 0.05],
                expo: 2,
            });

            let py = terrain.getHeight(0, 0) + 3;
            if (py < 1) py = 1;

            phy.change({ name: "buggy", pos: [0, py, 0] });
            phy.remove("floor");

            // update after physic step
            phy.setPostUpdate(update);
        };

        const update = (stamp = 0) => {
            if (!buggy) return;

            let p = buggy.position;
            let d = math.distanceArray([p.x, 0, p.z]);

            if (d > 50) {
                phy.change([
                    { name: "terra", decal: [p.x, 0, p.z] },
                    { name: "buggy", pos: [0, p.y, 0] },
                ]);
            }

            // update controls
            tm.now = stamp;
            tm.delta = tm.now - tm.then;
            tm.dt = tm.delta * 0.001;
            if (controls) controls.up(tm.dt);


            // Ajuste manual de la cámara en caso de que no se actualice correctamente
            // camera.position.lerp(new THREE.Vector3(p.x, p.y + 2, p.z + 5), 0.1);
            // camera.lookAt(p);
        };

        const applyMaterial = (model) => {
            const mat = {};
            const path = "./assets/textures/buggy/";

            mat["carGlass"] = phy.getMat("carGlass");

            mat["body"] = phy.material({
                name: "body",
                roughness: 0.5,
                metalness: 1.0,
                envMapIntensity: 1.35,
                map: phy.texture({ url: path + 'body_c.jpg' }),
                clearcoat: 1.0,
                clearcoatRoughness: 0.03,
                sheen: 0.5,
            });

            mat["extra"] = phy.material({
                name: "extra",
                roughness: 0.1,
                metalness: 0.6,
                map: phy.texture({ url: path + 'extra_c.jpg' }),
                normalMap: phy.texture({ url: path + "extra_n.jpg" }),
                normalScale: [1, -1],
            });

            mat["pilote"] = phy.material({
                name: "pilote",
                roughness: 0.4,
                metalness: 0.6,
                map: phy.texture({ url: path + 'pilote_c.jpg' }),
            });

            let wheel_map = phy.texture({ url: path + "wheel_c.jpg" });
            let wheel_normal = phy.texture({ url: path + "wheel_n.jpg" });

            mat["wheel"] = phy.material({
                name: "wheel",
                roughness: 0.5,
                metalness: 1.0,
                map: wheel_map,
                normalMap: wheel_normal,
                normalScale: [1, -1],
                clearcoat: 1.0,
                clearcoatRoughness: 0.03,
                sheen: 0.5,
            });

            mat["pneu"] = phy.material({
                name: "pneu",
                roughness: 0.7,
                metalness: 0.1,
                map: wheel_map,
                normalMap: wheel_normal,
                normalScale: [2, -2],
            });

            Object.keys(model).forEach((key) => {
                if (mat[key]) {
                    model[key].material = mat[key];
                }
            });
        };

        return () => { };
    }, [scene, renderer, camera]);

    return null;
}

export default PhyVehicleTerrain;