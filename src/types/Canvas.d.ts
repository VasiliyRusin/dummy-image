import { FontWeight } from "./FontSettings";

export interface CanvasParams {
  width: number;
  height: number;
  text: string;
  fontFace: string;
  fontWeight: FontWeight;
  color: string;
  backgroundColor: string;
}
