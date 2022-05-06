// used to give a stable (based on object reference identity) numerical key for
// a given object. useful for react `key` when mapping

export class ObjectKeyMap {
  #id: number;
  #map: WeakMap<object, number>;

  constructor() {
    this.#id = Number.MIN_SAFE_INTEGER;
    this.#map = new WeakMap();
  }

  get(key: object): number {
    const existing = this.#map.get(key);
    if (existing !== undefined) {
      return existing;
    }
    const ret = this.#id;
    // hopefully won't overflow
    this.#id++;
    this.#map.set(key, ret);
    return ret;
  }
}
