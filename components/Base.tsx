"use client";

import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../app/store/slices/mainSlice";
import * as baseActions from "../app/store/slices/baseSlice";
import { FC, ReactNode } from "react";
import { Object3D, Group } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Html } from "@react-three/drei";
import type { RootState, AppDispatch } from "../app/store/store";
import OpenedFormWrapper from "./forms/OpenedFormWrapper";
import FormErrors from "./forms/FormErrors";

import type { GeometryParams } from "./geometryForms/geometryTypes";
import Cylinder from "./geometryForms/Cylinder";
import Sphere from "./geometryForms/Sphere";
import Torus from "./geometryForms/Torus";
import { OrbitControls } from "@react-three/drei";

const stationRadius = 2;

type GetNameFormProps = {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (val: string) => void;
};

function Section({
  position,
  rotation,
  size,
  color,
  sectionNumber,
  textColor,
}: GeometryParams) {
  return (
    <group position={position} rotation={rotation}>
      <Cylinder
        position={[0, -size[0], 0]}
        rotation={[0, 0, 0]}
        size={[0.2, 0.2, size[0] * 2, 8]}
        color={color}
      />
      <Sphere
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        size={size}
        color={color}
        sectionNumber={sectionNumber}
      />
      <Html
        transform
        position={[0, 0.3, 0.65]}
        rotation={[0.8 * Math.PI, Math.PI, 0]}
      >
        <div style={{ color: textColor, userSelect: "none" }}>
          {sectionNumber}
        </div>
      </Html>
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
      ref.current.rotation.z += -delta * 0.5; // скорость вращения
    }
  });

  return <group ref={ref}>{children}</group>;
}

function GetNameForm({ value, onChange, onSubmit }: GetNameFormProps) {
  return (
    <form
      style={{ display: "flex", flexDirection: "column" }}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
    >
      <input
        style={{
          width: "100%",
          backgroundColor: "black",
          color: "white",
          border: "2px solid aliceblue",
        }}
        type="text"
        placeholder="Base name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        className="mainButton"
        style={{ border: "2px solid aliceblue", alignSelf: "center" }}
        type="submit"
      >
        Create Base
      </button>
    </form>
  );
}

export default function Base() {
  const dispatch: AppDispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const baseColor = "aliceblue";
  const baseName = useSelector((state: RootState) => state.base.baseName);
  const sections_1 = useSelector((state: RootState) => state.base.sections_1);
  const sections_2 = useSelector((state: RootState) => state.base.sections_2);
  const sections_3 = useSelector((state: RootState) => state.base.sections_3);
  const userEmail = useSelector((state: RootState) => state.main.userEmail);

  const [showForm, setShowForm] = useState(false);
  const [newBaseName, setNewBaseName] = useState("");

  const [showcentralFormFields, setCentralFormFields] =
    useState<ReactNode>(null);

  async function createBase(name: string) {
    if (name.length === 0) return;
    dispatch(baseActions.setBaseName(name));
    setShowForm(false);
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/base/createBase`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          baseName: name,
        }),
      }
    );
    let baseResponse = await response.json();
    if (response.ok) {
      if (baseResponse.baseState === 1) {
        console.log("base created");
      }
    } else {
      console.log("error!");
      console.log(baseResponse);
    }
  }

  useEffect(() => {
    async function checkBaseExistance() {
      let response = await fetch("/api/base/getBaseData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      });
      let baseResponse = await response.json();

      if (response.ok) {
        if (baseResponse.baseState === 1) {
          dispatch(baseActions.setBaseName(baseResponse.message.station_name));
          dispatch(
            baseActions.setCirclesCount(baseResponse.message.circles_count)
          );
          dispatch(
            baseActions.setSectionCount(baseResponse.message.sections_count)
          );
          dispatch(baseActions.setSections_1(baseResponse.message.sections_1));
          dispatch(baseActions.setSections_2(baseResponse.message.sections_2));
          dispatch(baseActions.setSections_3(baseResponse.message.sections_3));
        } else {
          setShowForm(true);
        }
      } else {
        console.log("error!");
        console.log(baseResponse);
      }
    }

    checkBaseExistance();
  }, []);

  let baseCircle1 = [...sections_1];
  baseCircle1.sort((a, b) => a - b);

  let baseCircle2 = [...sections_2];
  baseCircle2.sort((a, b) => a - b);
  console.log(baseCircle2);

  const circle_1: ReactNode[] = baseCircle1.map((item) => {
    let angle = ((Number(item) - 1) * Math.PI) / 4;

    return (
      <Section
        position={[
          stationRadius * Math.sin(angle),
          stationRadius * Math.cos(angle),
          0,
        ]}
        rotation={[0, 0, -angle]}
        size={[0.7]}
        color={baseColor}
        sectionNumber={item}
        textColor={baseColor}
        key={item}
      ></Section>
    );
  });

  const circle_2: ReactNode[] = baseCircle2.map((item) => {
    let angle = ((Number(item) - 9) * Math.PI) / 4;

    return (
      <Section
        position={[
          2 * stationRadius * Math.sin(angle),
          2 * stationRadius * Math.cos(angle),
          0,
        ]}
        rotation={[0, 0, -angle]}
        size={[0.7]}
        color={baseColor}
        sectionNumber={item}
        textColor={baseColor}
        key={item}
      ></Section>
    );
  });

  const torus_1: ReactNode[] = baseCircle1.map((item, index, arr) => {
    let angle = ((item - 2) * Math.PI) / 4 - Math.PI / 4;
    if (index > 0) {
      if (Number(item) - Number(arr[index - 1]) === 1) {
        return (
          <Torus
            radius={stationRadius}
            color={baseColor}
            angle={angle}
            key={item}
          />
        );
      }
    } else {
      if (arr.at(-1) == 8) {
        return (
          <Torus
            radius={stationRadius}
            color={baseColor}
            angle={angle}
            key={item}
          />
        );
      }
    }
    return null;
  });

  const torus_2: ReactNode[] = baseCircle2.map((item, index, arr) => {
    const itemInCircle = item - 8;
    let angle = ((itemInCircle - 2) * Math.PI) / 4 - Math.PI / 4;
    console.log(item + " second angle = " + angle);
    if (index > 0) {
      console.log("index > 0");
      if (item - arr[index - 1] === 1) {
        console.log("111");
        return (
          <Torus
            radius={2 * stationRadius}
            color={baseColor}
            angle={angle}
            key={item}
          />
        );
      }
    } else {
      console.log("index = 0");
      if (arr.at(-1) == 16) {
        console.log("2");
        return (
          <Torus
            radius={2 * stationRadius}
            color={baseColor}
            angle={angle}
            key={item}
          />
        );
      }
    }
    return null;
  });

  return (
    <div className="centerWindow glass self-center">
      <div className="blackWindow text-center text-white">
        {
          <Canvas
            ref={canvasRef}
            className="nightSky"
            camera={{
              fov: 45,
              position: [0, 0, 8],
              near: 0.1,
              far: 100,
            }}
          >
            <OrbitControls />
            <directionalLight position={[-2, 1, 1]} intensity={2} />
            <RotatingGroup>
              <Sphere
                position={[0, 0, 0]}
                rotation={[Math.PI / 2, 0, 0]}
                size={[1]}
                color={baseColor}
                sectionNumber={0}
              >
                <Html transform position={[0, 1, 0]}>
                  <div style={{ color: baseColor, userSelect: "none" }}>
                    {baseName}
                  </div>
                </Html>
              </Sphere>
              {torus_1}
              {circle_1}
              {torus_2}
              {circle_2}
            </RotatingGroup>
          </Canvas>
        }
      </div>
      {showForm && (
        <OpenedFormWrapper
          addFormStyle={{ right: "calc(50% - 100px)", width: "200px" }}
        >
          <GetNameForm
            value={newBaseName}
            onChange={setNewBaseName}
            onSubmit={createBase}
          />
        </OpenedFormWrapper>
      )}
    </div>
  );
}
