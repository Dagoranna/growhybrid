"use client";

import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as baseActions from "../../app/store/slices/baseSlice";
import { Object3D } from "three";
import { Edges } from "@react-three/drei";

import type { RootState, AppDispatch } from "../../app/store/store";
import type { GeometryParams } from "./geometryTypes";

export default function Sphere({
  position,
  rotation,
  size,
  color,
  sectionNumber = null,
  children,
}: GeometryParams) {
  const ref = useRef<Object3D | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const [isPointed, setIsPointed] = useState(false);

  const activeSection = useSelector(
    (state: RootState) => state.base.activeSection
  );

  function clickSphere(sectionNumber: number | null) {
    if (activeSection === sectionNumber) {
      dispatch(baseActions.setActiveSection(null));
    } else {
      dispatch(baseActions.setActiveSection(sectionNumber));
    }
  }

  const isSelected = activeSection === sectionNumber;

  /*
  args:
    radius?: number,          // default: 1
    widthSegments?: number,   // default: 32; min:3
    heightSegments?: number,  // default: 16; min:2
    phiStart?: number,        // start arc width angle; default: 0
    phiLength?: number,       // horiz. arc length; default: 2*PI
    thetaStart?: number,      // start arc height angle; default: 0
    thetaLength?: number      // vertic. arc length; default: PI
  */

  return (
    <mesh
      ref={ref}
      position={position}
      rotation={rotation}
      onPointerOver={() => setIsPointed(true)}
      onPointerOut={() => setIsPointed(false)}
      onClick={() => clickSphere(sectionNumber)}
    >
      <sphereGeometry args={[size[0], 8, 8]} />
      <meshStandardMaterial
        color={isSelected ? "DodgerBlue" : color}
        metalness={0.6}
        roughness={0.2}
      />
      <Edges
        color={isPointed ? "aliceblue" : isSelected ? "yellow" : "black"}
        scale={isPointed ? 1.02 : 1}
      />
      {children}
    </mesh>
  );
}
