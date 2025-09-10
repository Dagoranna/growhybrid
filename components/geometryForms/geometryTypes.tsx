import { ReactNode } from "react";

export type Size = number[] & { length: 1 | 2 | 3 | 4 };
export type Coords = [number, number, number];
export type GeometryParams = {
  position: Coords;
  rotation: Coords;
  size: Size;

  color?: string;
  textColor?: string;
  children?: ReactNode;
  sectionNumber?: number | null;
};

export type TorusProps = {
  radius: number;
  color: string;
  angle: number;
};
