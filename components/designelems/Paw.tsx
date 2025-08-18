"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import styles from "./forms.module.css";

type MyProps = {
  width: number;
};

export default function Paw({ width }: MyProps) {
  const pawRef = useRef<HTMLCanvasElement>(null);
  const height = 300 * (width / 400);

  useEffect(() => {
    const canvas = pawRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rootStyles = getComputedStyle(document.documentElement);
    const mainColor = rootStyles.getPropertyValue("--main-shadow").trim();
    const fillColor = rootStyles.getPropertyValue("--main-color-transp").trim();
    ctx.strokeStyle = mainColor;
    ctx.shadowColor = mainColor;
    ctx.fillStyle = fillColor;
    ctx.shadowBlur = 15;

    ctx.save();
    ctx.scale(width / 100, width / 100);
    ctx.beginPath();
    ctx.arc(36, 15, 14, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(65, 15, 14, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(15, 36, 14, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(85, 36, 14, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(50, 45, 15, Math.PI + Math.PI / 4, -Math.PI / 4);
    ctx.arc(61, 60, 15, -Math.PI / 4, Math.PI - Math.PI / 4);
    ctx.arc(39, 60, 15, Math.PI / 4, Math.PI + Math.PI / 4);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  }, []);

  return (
    <canvas
      ref={pawRef}
      width={width}
      height={height}
      style={{
        position: "absolute",
        bottom: "5px",
        right: "5px",
        borderRadius: "30%",
      }}
    ></canvas>
  );
}
