"use client";

import type { GeometryParams } from "./geometryTypes";

export default function Cylinder({
  position,
  rotation,
  size,
  color,
}: GeometryParams) {
  return (
    <mesh position={position} rotation={rotation}>
      {/* args: radiusTop, radiusBottom, height, radialSegments */}
      <cylinderGeometry args={size} />
      <meshStandardMaterial color={color} metalness={1} roughness={0.4} />
    </mesh>
  );
}
