import { FirstPersonControls, OrbitControls } from "@react-three/drei";
import { CameraControlTypes } from "../types/CameraControlsType";


function CameraControlsManager({ type = CameraControlTypes.ORBIT }) {
    switch (type) {
        case CameraControlTypes.FIRST_PERSON:
            return <FirstPersonControls />;
        case CameraControlTypes.ORBIT:
        default:
            return <OrbitControls />;
    }
}

export default CameraControlsManager;