"use client";

import { MutableRefObject, Suspense } from "react";
import { OrbitControls, PerspectiveCamera, Html } from "@react-three/drei";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import Loader from "./Loader"; // Assuming you have a custom loader for models
import IPhone from "./IPhone"; // Assuming this is your custom component for rendering iPhones or models

interface ModelViewProps {
  index: number;
  groupRef: MutableRefObject<THREE.Group>;
  gsapType: string;
  controlRef: MutableRefObject<any>;
  setRotationState: React.Dispatch<React.SetStateAction<number>>;
  size: string;
  item: any; // The item being passed from the parent (Model.tsx);
  position: string;
}

const ModelView: React.FC<ModelViewProps> = ({
  index,
  groupRef,
  gsapType,
  controlRef,
  setRotationState,
  size,
  item,
}) => {

  return (
    <group ref={groupRef} name={index === 1 ? "small" : "large"} position={[0, 0, 0]}>
      <Suspense fallback={<Loader />}>
        <IPhone
          scale={index === 1 ? [15, 15, 15] : [17, 17, 17]} // Adjust the scale based on the size prop
          item={item} // Pass the item object (like model data) to the IPhone component
          size={size} // Pass the current size (small/large) to the IPhone component
        />
      </Suspense>
    </group>
  );
};

export default ModelView;
