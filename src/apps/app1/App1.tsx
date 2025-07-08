import { useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber'
// import CameraControlsManager from '../../shared/r3f/camera-controls/manager/CameraControlsManager'
// import { CameraControlTypes } from '../../shared/r3f/camera-controls/types/CameraControlsType'
// import PhyTower from '../../shared/r3f/physics-phy/prefabs/phy-tower/PhyTower'
import PhyVehicleTerrain from '../../shared/r3f/physics-phy/prefabs/phy-vehicle-terrain/PhyVehicleTerrain'

function Box(props: ThreeElements['mesh']) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    useFrame((state, delta) => {
        if (active) {
            console.log("state useFrame r3f: ", state);
        }
        meshRef.current.rotation.x += delta;
    })
    return (
        <mesh
            {...props}
            ref={meshRef}
            scale={active ? 1.5 : 1}
            onClick={(event) => {
                console.log("onClick event: ", event);
                setActive(!active)
            }}
            onPointerOver={(event) => {
                console.log("onPointerOver event: ", event);
                setHover(true)
            }}
            onPointerOut={(event) => {
                console.log("onPointerOut event: ", event);
                setHover(false)
            }}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : '#2f74c0'} />
        </mesh>
    )
}
function App1() {
    return (
        <Canvas>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <Box position={[-1.2, 0, 0]} />
            <Box position={[1.2, 0, 0]} />

            {/* <PhyTower /> */}

            <PhyVehicleTerrain />

            {/* <CameraControlsManager type={CameraControlTypes.ORBIT} /> */}
        </Canvas>
    )
}

export default App1;