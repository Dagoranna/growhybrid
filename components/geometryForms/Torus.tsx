"use client";

import React from "react";

import type { TorusProps } from "./geometryTypes";

export default function Torus({ radius, color, angle }: TorusProps) {
  return (
    <mesh rotation={[0, 0, -angle]}>
      {/* args = [radius, tube, radialSegments, tubularSegments, arc] */}
      <torusGeometry args={[radius, 0.2, 8, 8, Math.PI / 4]} />
      <meshStandardMaterial color={color} metalness={1} roughness={0.4} />
    </mesh>
  );
}
