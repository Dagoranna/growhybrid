"use client";

import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../app/store/slices/mainSlice";
import { FC, ReactNode } from "react";
import { Object3D, Group } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";

import type { RootState, AppDispatch } from "../app/store/store";

type Size = number[] & { length: 3 | 4 };
type Coords = [number, number, number];
type GeometryParams = {
  position: Coords;
  rotation: Coords;
  size: Size;

  color?: string;
  children?: ReactNode;
};

type TunnelProps = {
  color: string;
  angle: number;
};

function Sphere({ position, rotation, size, color }: GeometryParams) {
  const ref = useRef<Object3D | null>(null);
  const [isPointed, setIsPointed] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  return (
    <mesh
      ref={ref}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => setIsPointed(true)}
      onPointerOut={(e) => setIsPointed(false)}
      onClick={(e) => (isSelected ? setIsSelected(false) : setIsSelected(true))}
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

function Section({ position, rotation, size, color }: GeometryParams) {
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

  const baseStructure = { 1: [1, 2, 5, 6, 7, 8] }; // FOR TEST

  const circle_1: ReactNode[] = baseStructure["1"].map((item) => {
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
        key={item}
      ></Section>
    );
  });

  baseStructure["1"] = baseStructure["1"].sort();

  const tunnels_1: ReactNode[] = baseStructure["1"].map((item, index, arr) => {
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
