
![DummyImageJS](https://user-images.githubusercontent.com/3685852/120081483-16a83480-c0e8-11eb-839c-0c0a83bcb2b8.png)


Это простой генератор глупых картинок c кешированием. Работает так же просто как камень 🪨.

```TypeScript
import { ImageManager } from "dummyimagejs";

// Создаем менеджер, он позволет гарантировать
// что одно и то же изображение создастся лишь однажды
const imageManager = new ImageManager();

// Создаем само изображение, если не передавать параметры
// то будут использоваться параметры по умолчанию
const image = imageManager.createImage();

// Изображение будет создано и закешировано
image.asBase64() // data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...

// Вернется закешированое изображение
image.asBase64() // data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...
```

Мы получим

![600 × 400](https://user-images.githubusercontent.com/3685852/120081380-92ee4800-c0e7-11eb-8a6a-b01cd9b7bce1.png)


А пример ниже, генерирует картинку из шапки

```TypeScript
import { ImageManager } from "dummyimagejs";

const imageManager = new ImageManager();
const image = imageManager.createImage({
  width: 1012,
  height: 300,
  fontWeight: 700,
  color: "#000000",
  backgroundColor: "#f7e017",
  text: "🎉  DummyImageJS  🎉"
});
```

# Установка 🪄

```sh
npm -i dummyimagejs
```

# Документация 📖

## Image

```TypeScript
interface ImageParams {
  width?: number;
  height?: number;
  text?: string;
  fontFace?: string;
  fontWeight?: FontWeight;
  color?: string;
  backgroundColor?: string;
}

class Image {
    constructor(params?: ImageParams)
```

Сам по себе класс [[Image]](#image) реализует кеширование сгенерированного изображения при вызове метода [asBase64()](#asbase64) или [asBlob()](#asblob), однако это кеширование имеет мало смысла, если мы можем созать десяток инстансов [[Image]](#image), поэтому нам нужен менеджер, гарантирующий создание лишь одного инстанса [[Image]](#image) с идентичными параметрами.

> Исходя из логических соображений Image хранит лишь один закешированный объект одновременно.

```TypeScript
image = new Image();

// Сгенерирует base64 и закеширует
image.asBase64()

// Сгенерирует blob и закеширует
image.asBlob()

// Выгрузит blob из памяти,
// сгенерирует base64 и закеширует
image.asBase64()
```

### Геттеры

#### key

```TypeScript
public get key(): string
```

### Методы

#### asBase64

```TypeScript
public async asBase64(): Promise<string | undefined>
```

#### asBlob

```TypeScript
public async asBlob(): Promise<string | undefined>
```

#### beforeDelete

```TypeScript
public beforeDelete(): void
```

### Статические методы

#### getKey

```TypeScript
public static getKey(params?: ImageParams): string
```

## ImageManager

```TypeScript
class ImageManager extends Manager<Image>
```

Реализует кеширование экземпляров [[Image]](#image), [[ImageManager]](#imagemanager) — [синглтон](<https://ru.wikipedia.org/wiki/%D0%9E%D0%B4%D0%B8%D0%BD%D0%BE%D1%87%D0%BA%D0%B0_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F)>), это позволяет гарантировать кеширование единственной копии изображения в любом месте.

### Методы

#### createImage

```TypeScript
interface ImageParams {
  width?: number;
  height?: number;
  text?: string;
  fontFace?: string;
  fontWeight?: FontWeight;
  color?: string;
  backgroundColor?: string;
}

createImage (params?: ImageParams): Image
```

#### deleteImage

```TypeScript
deleteImage (key: string): boolean
```

#### deleteAll

```TypeScript
deleteAll ():  void
```

## Manager

```TypeScript
abstract class Manager<T> extends Singleton implements Map<string, T>
```

Возможно у вас возникнет потребность в создании своего собственного менеджера, сделать это можно наследуясь от класса [[Manager]](#manager) подробнее в разделе [Создание собственного менеджера](#реализация-собственного-менеджера)

# Примеры

### Реализация собственного менеджера

```TypeScript
import { Manager, Image } from "dummyimagejs";
import { ImageParams } from "dummyimagejs/types/Image";

interface TemporalyCachedImage {
  image: Image;
  timer: number;
}

export default class TemporalyCachedImageManager extends
  Manager<TemporalyCachedImage> {
  public createImage(params?: ImageParams): Image {
    const key = Image.getKey(params);
    let cached = this.get(key);

    if (!cached) {
      cached = {
        image: new Image(params),
        timer: setTimeout(() => {
          this.deleteImage(key);
        }, 10000)
      };

      this.set(key, cached);
    }

    return cached.image;
  }

  public deleteImage(key: string): boolean {
    const cached = this.get(key);

    if (cached) {
      cached.image?.beforeDelete();

      return this.delete(key);
    }

    return false;
  }

  public deleteAll(): void {
    this.forEach(({ image }) => image.beforeDelete());

    this.clear();
  }
}
```

> Written with [StackEdit](https://stackedit.io/).
