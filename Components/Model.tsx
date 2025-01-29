"use client"

import { useGSAP } from "@gsap/react"
import { OrbitControls, PerspectiveCamera, Html } from "@react-three/drei"
import Lights from './Lights'
import gsap from "gsap";
import ModelView from "./Modelview";
import { useEffect, useRef, useState } from "react";
import yellowImg from "@/public/assets/images/yellow.jpg"
import * as THREE from 'three';
import { Canvas } from "@react-three/fiber";
import { models, sizes } from "@/data";
import { animateWithGsapTimeline } from "@/app/utils/animations";

const Model = () => {
  const [size, setSize] = useState('small');
  const [model, setModel] = useState({
    title: 'iPhone 15 Pro in Natural Titanium',
    color: ['#8F8A81', '#FFE7B9', '#6F6C64'],
    img: yellowImg.src
  });

  // camera control for the model view
  const cameraControlSmall = useRef<any>(null);
  const cameraControlLarge = useRef<any>(null);

  // model
  const small = useRef(new THREE.Group());
  const large = useRef(new THREE.Group());

  // rotation
  const [smallRotation, setSmallRotation] = useState(0);
  const [largeRotation, setLargeRotation] = useState(0);

  const tl = gsap.timeline();

  useEffect(() => {
    if(size === 'large') {
      animateWithGsapTimeline(tl, small, smallRotation, '#view1', '#view2', {
        transform: 'translateX(-100%)',
        duration: 2
      })
    }

    if(size === 'small') {
      animateWithGsapTimeline(tl, large, largeRotation, '#view2', '#view1', {
        transform: 'translateX(0)',
        duration: 2
      })
    }
  }, [size]);

  useGSAP(() => {
    gsap.to('#heading', { y: 0, opacity: 1 })
  }, []);

  return (
    <section className="common-padding">
      <div className="screen-max-width">
        <h1 id="heading" className="section-heading">Take a closer look.</h1>
        <div className="flex flex-col items-center mt-5">
          {/* Single Canvas wrapping the model views */}
          <div className="w-full h-[75vh] md:h-[90vh] overflow-hidden relative">
            <Canvas
              className={`w-full h-full`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }}
            >
              {/* Ambient light and 3D controls */}
              <ambientLight intensity={0.6} />
              <PerspectiveCamera makeDefault position={[0, 0, 4]} />
              <Lights />
              <OrbitControls
                makeDefault
                ref={cameraControlSmall}
                enableZoom={false}
                enablePan={false}
                rotateSpeed={0.4}
                target={new THREE.Vector3(0, 0, 0)}

              />

              {/* Model Views */}
              <ModelView 
                index={1}
                groupRef={small}
                gsapType="view1"
                controlRef={cameraControlSmall}
                setRotationState={setSmallRotation}
                item={model}
                size={size}
                position=""
              />  

            </Canvas>
          </div>

          <div className="mx-auto w-full">
            <p className="text-sm font-light text-center mb-5">{model.title}</p>

            <div className="flex-center">
              <ul className="color-container">
                {models.map((item, i) => (
                  <li key={i} className="w-6 h-6 rounded-full mx-2 cursor-pointer" style={{ backgroundColor: item.color[0] }} onClick={() => setModel(item)} />
                ))}
              </ul>

              <button className="size-btn-container">
                {sizes.map(({ label, value }) => (
                  <span key={label} className="size-btn" style={{ backgroundColor: size === value ? 'white' : 'transparent', color: size === value ? 'black' : 'white'}} onClick={() => setSize(value)}>
                    {label}
                  </span>
                ))}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Model;
