import { FontWeight } from "./types/FontSettings";
import { CanvasParams } from "./types/Canvas";
import { minMax } from "./utils";

export default class Canvas {
  public el: HTMLCanvasElement | null;

  private text: string;
  private fontFace: string;
  private fontWieght: FontWeight;
  private width: number;
  private height: number;
  private color: string;
  private backgroundColor: string;
  private ctx?: CanvasRenderingContext2D | null;

  constructor(params: CanvasParams) {
    this.el = document.createElement("canvas");

    this.ctx = this.el.getContext("2d");

    const {
      width,
      height,
      text,
      fontFace,
      fontWieght,
      color,
      backgroundColor
    } = params;

    this.text = text;
    this.fontFace = fontFace;
    this.fontWieght = fontWieght;
    this.color = color;
    this.backgroundColor = backgroundColor;

    this.el.width = this.width = width;
    this.el.height = this.height = height;

    if (this.ctx) {
      this.draw();
    } else {
      throw Error("Browser does not support canvas 2d context");
    }
  }

  private draw(): void {
    this.drawBackground();
    this.drawText();
  }

  private drawBackground(): void {
    const { ctx, width, height } = this;

    if (ctx) {
      ctx.fillStyle = this.backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }
  }

  private drawText(): void {
    const { ctx, text, fontFace, fontWieght, width, height } = this;

    if (ctx) {
      const fontSize = minMax((width / text.length) * 1.15, {
        min: 10,
        max: height / 2
      });

      ctx.font = `${fontWieght} ${fontSize}px ${fontFace}`;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillStyle = this.color;
      ctx.fillText(text, width / 2, height / 2);
    }
  }

  public async asBase64(): Promise<string | undefined> {
    return new Promise((resolve) => resolve(this.el?.toDataURL()));
  }

  public async asBlob(): Promise<string | undefined> {
    return new Promise((resolve) =>
      this.el?.toBlob((blob) => resolve(URL.createObjectURL(blob)))
    );
  }

  public clearMemory(url: string): void {
    URL.revokeObjectURL(url);
  }
}
