"use client";

import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../app/store/slices/mainSlice";
import * as baseActions from "../app/store/slices/baseSlice";
import { FC, ReactNode } from "react";
import { Object3D, Group } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import type { SectionNumbers } from "../app/store/slices/baseSlice";
import type { RootState, AppDispatch } from "../app/store/store";

type Size = number[] & { length: 3 | 4 };
type Coords = [number, number, number];
type GeometryParams = {
  position: Coords;
  rotation: Coords;
  size: Size;

  color?: string;
  children?: ReactNode;
  sectionNumber?: SectionNumbers | null;
};

type TunnelProps = {
  color: string;
  angle: number;
};

function Sphere({
  position,
  rotation,
  size,
  color,
  sectionNumber = null,
}: GeometryParams) {
  const ref = useRef<Object3D | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const [isPointed, setIsPointed] = useState(false);

  const activeSection = useSelector(
    (state: RootState) => state.base.activeSection
  );

  function clickSphere(sectionNumber: SectionNumbers | null) {
    if (activeSection === sectionNumber) {
      dispatch(baseActions.setActiveSection(null));
    } else {
      dispatch(baseActions.setActiveSection(sectionNumber));
    }
  }

  const isSelected = activeSection === sectionNumber;

  return (
    <mesh
      ref={ref}
      position={position}
      rotation={rotation}
      onPointerOver={() => setIsPointed(true)}
      onPointerOut={() => setIsPointed(false)}
      onClick={() => clickSphere(sectionNumber)}
    >
      <sphereGeometry args={size} />
      <meshStandardMaterial
        color={isSelected ? "DodgerBlue" : color}
        metalness={0.6}
        roughness={0.2}
      />
      <Edges
        color={isPointed ? "lightblue" : isSelected ? "yellow" : "black"}
        scale={isPointed ? 1.02 : 1.0}
      />
    </mesh>
  );
}

function Cylinder({ position, rotation, size, color }: GeometryParams) {
  return (
    <mesh position={position} rotation={rotation}>
      {/* args: radiusTop, radiusBottom, height, radialSegments */}
      <cylinderGeometry args={size} />
      <meshStandardMaterial color={color} metalness={1} roughness={0.4} />
    </mesh>
  );
}

function Tunnel({ color, angle }: TunnelProps) {
  return (
    <mesh rotation={[0, 0, -angle]}>
      {/* args = [radius, tube, radialSegments, tubularSegments, arc] */}
      <torusGeometry args={[2, 0.2, 8, 8, Math.PI / 4]} />
      <meshStandardMaterial color={color} metalness={1} roughness={0.4} />
    </mesh>
  );
}

function Section({
  position,
  rotation,
  size,
  color,
  sectionNumber,
}: GeometryParams) {
  return (
    <group position={position} rotation={rotation}>
      <Cylinder
        position={[0, -size[2] / 8, 0]}
        rotation={[0, 0, 0]}
        size={[0.2, 0.3, size[1] / 4, 8]}
        color={color}
      />
      <Sphere
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        size={size}
        color={color}
        sectionNumber={sectionNumber}
      />
    </group>
  );
}

function RotatingGroup({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.rotation.x = -Math.PI / 4;
    }
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.5; // скорость вращения
    }
  });

  return <group ref={ref}>{children}</group>;
}

export default function Base() {
  const dispatch: AppDispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const baseColor = "aliceblue";
  const baseStructure = useSelector((state: RootState) => state.base.sections);

  //const baseStructure = { 1: [1, 2, 5, 6, 7, 8] }; // FOR TEST
  let baseCircle1 = [...baseStructure["1"]];
  baseCircle1.sort();

  const circle_1: ReactNode[] = baseCircle1.map((item) => {
    let angle = ((Number(item) - 1) * Math.PI) / 4;

    const stationRadius = 2;
    return (
      <Section
        position={[
          stationRadius * Math.sin(angle),
          stationRadius * Math.cos(angle),
          0,
        ]}
        rotation={[0, 0, -angle]}
        size={[0.7, 8, 8]}
        color={baseColor}
        sectionNumber={item}
        key={item}
      ></Section>
    );
  });

  const tunnels_1: ReactNode[] = baseCircle1.map((item, index, arr) => {
    let angle = ((Number(item - 1) - 1) * Math.PI) / 4 - Math.PI / 4;
    if (index > 0) {
      if (Number(item) - Number(arr[index - 1]) === 1) {
        return <Tunnel color={baseColor} angle={angle} key={item} />;
      }
    } else {
      if (arr.at(-1) == 8) {
        return <Tunnel color={baseColor} angle={angle} key={item} />;
      }
    }
    return null;
  });

  return (
    <div className="centerWindow glass self-center">
      <div className="blackWindow text-center text-white">
        {
          <Canvas ref={canvasRef} className="nightSky">
            <directionalLight position={[-2, 1, 1]} intensity={2} />
            <RotatingGroup>
              <Sphere
                position={[0, 0, 0]}
                rotation={[Math.PI / 2, 0, 0]}
                size={[1, 8, 8]}
                color={baseColor}
                sectionNumber={0}
              />
              {tunnels_1}
              {circle_1}
            </RotatingGroup>
          </Canvas>
        }
      </div>
    </div>
  );
}
