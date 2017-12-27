import expect from 'expect';

import Enumerable from '../Enumerable';

describe('Enumerable', () => {
  it('should be an Enumerable object', () => {
    expect(new Enumerable()).toBeA(Enumerable);
  });

  it('should return undefined if not initialized with a value', () => {
    const actual = new Enumerable()
      .where(() => true)
      .orderBy(() => 0)
      .skip(10)
      .take(3)
      .toArray();
    expect(actual).toBe(undefined);
  });

  it('should not require functions', () => {
    const actual = new Enumerable([1, 2, 3, 4, 5])
      .where()
      .orderBy()
      .skip()
      .take()
      .toArray();

    expect(actual).toEqual([1, 2, 3, 4, 5]);
  });

  it('should filter', () => {
    const actual = new Enumerable([1, 2, 3, 4, 5, 6, 7, 8, 9]).where(v => v % 2 == 0).toArray();
    expect(actual).toEqual([2, 4, 6, 8]);
  });

  it('should sort', () => {
    const orig = [9, 1, 6, 2, 8, 3, 5, 4, 7];
    const actual = new Enumerable(orig).orderBy((a, b) => a - b).toArray();
    expect(actual)
      .toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
      .toNotBe(orig);
  });

  it('should skip', () => {
    const actual = new Enumerable([1, 2, 3, 4, 5, 6, 7, 8, 9]).skip(8).toArray();
    expect(actual).toEqual([9]);
  });

  it('should take', () => {
    const actual = new Enumerable([1, 2, 3, 4, 5, 6, 7, 8, 9]).take(3).toArray();
    expect(actual).toEqual([1, 2, 3]);
  });

  it('should partition', () => {
    const actual = new Enumerable([1, 2, 3, 4, 5, 6, 7, 8, 9]).partition(4).toArray();
    expect(actual).toEqual([[1, 2, 3, 4], [5, 6, 7, 8], [9]]);
  });

  it('should filter+sort+skip+take', () => {
    const actual = new Enumerable([9, 1, 6, 2, 8, 3, 5, 4, 7])
      .where(v => v % 2 == 0)
      .orderBy((a, b) => a - b)
      .skip(2)
      .take(1)
      .toArray();
    expect(actual).toEqual([6]);
  });
});
