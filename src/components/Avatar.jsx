import { useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import * as THREE from "three";


export function Avartar() {
  // thanks to the_86_guy!
  // https://sketchfab.com/3d-models/low-poly-car-muscle-car-2-ac23acdb0bd54ab38ea72008f3312861
  let avartar = useLoader(
    GLTFLoader,
    process.env.PUBLIC_URL + "/models/avatar.glb"
  ).scene;
  const animations = avartar.animations;

  if (animations && animations.length > 0) {
    console.log("Model contains animations!");
    console.log(animations);
  } else {
    console.log("Model does not contain animations.");
  }

  useEffect(() => {
    avartar.scale.set(0.4, 0.4, 0.4);
    avartar.children[0].position.set(0, -1.2, 0);
  }, [avartar]); 
 

 
  return (
    <group>
      <mesh rotation={[0, Math.PI, 0]}>
        {<primitive object={avartar} position={[0, 0, -2.5]} />}
      </mesh>
    </group>
  );
}
