// used to provide a stable react `key` for an object. an ID should remain
// unchanged as long as an object exists and should be  distinct from all other
// IDs of past, present, and future objects.

export class Id {
  #num: number;

  constructor(num: number) {
    this.#num = num;
  }

  toNumber(): number {
    return this.#num;
  }
}

export class IdGen {
  #num: number;

  constructor() {
    this.#num = Number.MIN_SAFE_INTEGER;
  }

  gen(): Id {
    const next = this.#num;
    this.#num++;
    return new Id(next);
  }
}
