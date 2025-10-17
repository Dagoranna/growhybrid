"use client";

import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../app/store/slices/mainSlice";
import { FC, ReactNode } from "react";
import { Object3D } from "three";
import { Canvas, useFrame } from "@react-three/fiber";

import type { RootState, AppDispatch } from "../app/store/store";

type Coords = [number, number, number];

export default function Orbit() {
  const dispatch: AppDispatch = useDispatch();

  /*  const loginState = useSelector((state: RootState) => state.main.loginState);
  const userEmail = useSelector((state: RootState) => state.main.userEmail);
  const userName = useSelector((state: RootState) => state.main.userName);
  const screen = useSelector((state: RootState) => state.main.screen);*/

  //TODO: получить данные из базы о кол-ве и структуре станций. Отобразить через модуль "станция"
  const Cube = ({
    position,
    size,
    color,
  }: {
    position: Coords;
    size: Coords;
    color: string;
  }) => {
    const ref = useRef<Object3D | null>(null);
    useFrame((state, delta) => {
      if (ref.current) {
        ref.current.rotation.z += delta;
      }
    });

    return (
      <mesh ref={ref} position={position}>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  };

  return (
    <div className="centerWindow glass self-center">
      <div className="blackWindow text-center text-white">
        <Canvas>
          <directionalLight position={[0, 0, 2]} intensity={0.5} />
          <ambientLight intensity={0.5} />

          <group position={[0, 0, -2]}>
            <Cube position={[1, 0, 0]} size={[1, 1, 1]} color="lawngreen" />
            <Cube position={[-1, 0, 0]} size={[1, 1, 1]} color="yellow" />
          </group>

          <Cube position={[-1, 2, 0]} size={[1, 1, 1]} color="blue" />
          <Cube position={[1, 2, 0]} size={[1, 1, 1]} color="red" />
        </Canvas>
      </div>
    </div>
  );
}
