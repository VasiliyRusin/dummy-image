import Singleton from "./Singleton";

export default abstract class Manager<T> extends Singleton
  implements Map<string, T> {
  protected state: Map<string, T> = new Map();

  public size: number = this.state.size;

  public get [Symbol.toStringTag](): string {
    return "Manager";
  }

  public [Symbol.iterator](): IterableIterator<[string, T]> {
    return this.state[Symbol.iterator]();
  }

  public clear(): void {
    this.state.clear();
  }

  public delete(key: string): boolean {
    return this.state.delete(key);
  }

  public forEach(
    callbackfn: (value: T, key: string, map: Map<string, T>) => void,
    thisArg?: any
  ): void {
    this.state.forEach(callbackfn, thisArg);
  }

  public get(key: string): T | undefined {
    return this.state.get(key);
  }

  public has(key: string): boolean {
    return this.state.has(key);
  }

  public set(key: string, value: T): this {
    return this.state.set(key, value) as this;
  }

  public entries(): IterableIterator<[string, T]> {
    return this.state.entries();
  }

  public keys(): IterableIterator<string> {
    return this.state.keys();
  }

  public values(): IterableIterator<T> {
    return this.state.values();
  }
}
