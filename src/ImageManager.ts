import Manager from "./Manager";
import Image from "./Image";
import { ImageParams } from "./types/Image";

export default class ImageManager extends Manager<Image> {
  public createImage(params?: ImageParams): Image {
    const key = Image.getKey(params);
    let image = this.get(key);

    if (!image) {
      image = new Image(params);

      this.set(key, image);
    }

    return image;
  }

  public deleteImage(key: string): boolean {
    const image = this.get(key);
    image?.beforeDelete();

    return this.delete(key);
  }

  public deleteAll(): void {
    this.forEach((image) => image.beforeDelete());

    this.clear();
  }
}
