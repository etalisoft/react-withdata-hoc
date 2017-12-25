import expect from 'expect';

import parseSort from '../parseSort';

describe('parseSort', () => {
  it('should return undefined for ""', () => {
    const sort = '';
    const curSort = [];
    const rawColumns = [];
    expect(parseSort(sort, curSort, rawColumns)).toBe(undefined);
  });

  it('should return correctly for a string', () => {
    const sort = 'bob';
    const curSort = [];
    const rawColumns = [];
    expect(JSON.stringify(parseSort(sort, curSort, rawColumns))).toBe(
      JSON.stringify([{ column: 'bob', ascending: true }])
    );
  });

  it('should return correct for {column}', () => {
    const sort = { column: 'bob' };
    const curSort = [];
    const rawColumns = [];
    expect(JSON.stringify(parseSort(sort, curSort, rawColumns))).toBe(
      JSON.stringify([{ column: 'bob', ascending: true }])
    );
  });

  it('should return correct for {column,ascending}', () => {
    const sort = { column: 'bob', ascending: false };
    const curSort = [];
    const rawColumns = [];
    expect(JSON.stringify(parseSort(sort, curSort, rawColumns))).toBe(
      JSON.stringify([{ column: 'bob', ascending: false }])
    );
  });

  it('should return correct for [string,{column},{column,ascending}]', () => {
    const sort = ['1', { column: '2' }, { column: '3', ascending: false }];
    const curSort = [];
    const rawColumns = [];
    expect(JSON.stringify(parseSort(sort, curSort, rawColumns))).toBe(
      JSON.stringify([
        { column: '1', ascending: true },
        { column: '2', ascending: true },
        { column: '3', ascending: false },
      ])
    );
  });

  it('should return correct with curSort specified', () => {
    const sort = ['1', { column: '2' }, { column: '3', ascending: false }];
    const curSort = [
      { column: '1', ascending: true },
      { column: '2', ascending: true },
      { column: '3', ascending: false },
    ];
    const rawColumns = [];
    expect(JSON.stringify(parseSort(sort, curSort, rawColumns))).toBe(
      JSON.stringify([
        { column: '1', ascending: false },
        { column: '2', ascending: false },
        { column: '3', ascending: false },
      ])
    );
  });

  it('should return correct with rawColumns specified', () => {
    const sort = ['1', { column: '2' }, { column: '3', ascending: false }];
    const curSort = [];
    const rawColumns = [{ id: '1' }, { id: '2', ascending: false }, { id: '3', ascending: true }];
    expect(JSON.stringify(parseSort(sort, curSort, rawColumns))).toBe(
      JSON.stringify([
        { column: '1', ascending: true },
        { column: '2', ascending: false },
        { column: '3', ascending: false },
      ])
    );
  });

  it('should return correct with curSort and rawColumns specified', () => {
    const sort = [
      '1a',
      '1b',
      { column: '2a' },
      { column: '2b' },
      { column: '3a', ascending: false },
      { column: '3b', ascending: true },
    ];
    const curSort = [
      { column: '1a', ascending: false },
      { column: '2a', ascending: false },
      { column: '3a', ascending: false },
    ];
    const rawColumns = [
      { id: '1a', ascending: false },
      { id: '1b', ascending: false },
      { id: '2a', ascending: false },
      { id: '2b', ascending: false },
      { id: '3a', ascending: false },
      { id: '3b', ascending: false },
    ];
    expect(JSON.stringify(parseSort(sort, curSort, rawColumns))).toBe(
      JSON.stringify([
        { column: '1a', ascending: true },
        { column: '1b', ascending: false },
        { column: '2a', ascending: true },
        { column: '2b', ascending: false },
        { column: '3a', ascending: false },
        { column: '3b', ascending: true },
      ])
    );
  });
});
