import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

const CameraControls = () => {
  const { camera } = useThree();
  const moveSpeed = 0.1;
  const keyState = useRef({});

  useEffect(() => {
    const handleKeyDown = (event) => {
      keyState.current[event.key] = true;
    };

    const handleKeyUp = (event) => {
      keyState.current[event.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (!camera) return;

    if (keyState.current.w) camera.position.z -= moveSpeed;
    if (keyState.current.s) camera.position.z += moveSpeed;
    if (keyState.current.a) {
      camera.position.x -= moveSpeed;
    }
    if (keyState.current.d) {
      camera.position.x += moveSpeed;
    }
  });

  return null;
};

export default CameraControls;
