import { CanvasParams } from "./Canvas";

export type ImageCacheType = "base64" | "blob";

export type ImageParams = Partial<CanvasParams>;

interface ImageCache {
  type: ImageCacheType;
  src: string | undefined;
}
