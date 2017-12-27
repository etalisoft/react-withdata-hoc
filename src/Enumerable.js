const VALUE = Symbol('value');

export default class Enumerable {
  constructor(arr) {
    this[VALUE] = arr;
  }

  where(fn) {
    const value = this[VALUE];
    if (value && fn) {
      this[VALUE] = value.filter(fn);
    }
    return this;
  }

  orderBy(fn) {
    const value = this[VALUE];
    if (value && fn) {
      this[VALUE] = [...value].sort(fn);
    }
    return this;
  }

  skip(n) {
    const value = this[VALUE];
    if (value && n) {
      this[VALUE] = value.slice(n);
    }
    return this;
  }

  take(n) {
    const value = this[VALUE];
    if (value && n >= 0) {
      this[VALUE] = value.slice(0, n);
    }
    return this;
  }

  partition(size) {
    const value = this[VALUE];
    if (value && size > 0) {
      const partitions = [];
      for (var i = 0; i < value.length; i += size) {
        partitions.push(value.slice(i, i + size));
      }
      this[VALUE] = partitions;
    }
    return this;
  }

  toArray() {
    return this[VALUE];
  }
}
