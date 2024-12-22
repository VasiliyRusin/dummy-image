import { FontWeight } from "./types/FontSettings";
import { CanvasParams } from "./types/Canvas";
import { ImageCacheType, ImageParams, ImageCache } from "./types/Image";
import Canvas from "./Canvas";

export default class Image {
  private width: number = 600;
  private height: number = 400;
  private text: string = this.defaultText;
  private fontFace: string =
    "-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji";
  private fontWeight: FontWeight = "normal";
  private color: string = "#000000";
  private backgroundColor: string = "#cccccc";
  private canvas: Canvas;
  private cache?: ImageCache;

  constructor(params?: ImageParams) {
    // params setter will take care of this by themself
    this.params = params as CanvasParams;

    this.canvas = new Canvas(this.params);
  }

  private get params(): CanvasParams {
    const {
      width,
      height,
      text,
      fontFace,
      fontWeight,
      color,
      backgroundColor
    } = this;

    return {
      width,
      height,
      text,
      fontFace,
      fontWeight,
      color,
      backgroundColor
    };
  }

  private set params(value: CanvasParams) {
    const {
      width,
      height,
      fontFace,
      fontWeight,
      color,
      backgroundColor
    } = this;

    // Of course, TypeScript tells us what value is CanvasParams,
    // but even so, we cannot guarantee this in production.
    // Besides, it will compile even if the types not match.
    this.width = value?.width ?? value?.height ?? width;
    this.height = value?.height ?? value?.width ?? height;

    this.text = value?.text ?? this.defaultText;
    this.fontFace = value?.fontFace ?? fontFace;
    this.fontWeight = value?.fontWeight ?? fontWeight;
    this.color = value?.color ?? color;
    this.backgroundColor = value?.backgroundColor ?? backgroundColor;
  }

  private get defaultText(): string {
    return `${this.width} × ${this.height}`;
  }

  private clearMemory(): void {
    if (this.cache?.type === "blob" && this.cache?.src) {
      this.canvas.clearMemory(this.cache.src);
    }
  }

  private async getSrc(
    type: ImageCacheType,
    fn: (preview: Image) => Promise<string | undefined>
  ): Promise<string | undefined> {
    if (this.cache?.type !== type) {
      // If cache exists for "blob", it needs to free
      // allocated memory before update cache.
      this.clearMemory();

      this.cache = {
        type,
        src: await fn(this)
      };
    }

    return this.cache.src;
  }

  public get key(): string {
    return Image.getKey(this.params);
  }

  public async asBase64(): Promise<string | undefined> {
    return this.getSrc(
      "base64",
      async (preview) => await preview.canvas.asBase64()
    );
  }

  public async asBlob(): Promise<string | undefined> {
    return this.getSrc(
      "blob",
      async (preview) => await preview.canvas.asBlob()
    );
  }

  public beforeDelete(): void {
    this.clearMemory();
  }

  public static getKey(params?: ImageParams): string {
    // FixMe: it's not good that we needs to create new
    // Image instance to get default params, may be it
    // needs to move out default params from Image instance
    // to Image class.
    params = new Image(params).params;

    return Object.entries(params)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map((el) => el.join("="))
      .join("&");
  }
}
