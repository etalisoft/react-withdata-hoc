import expect from 'expect';

import parseFilter from '../parseFilter';

describe.only('parseFilter', () => {
  it('should parse correctly', () => {
    expect(parseFilter()).toEqual(undefined);
    expect(parseFilter('')).toEqual(undefined);
    expect(parseFilter('abc')).toEqual(['abc']);
    expect(parseFilter('  a  b   c  ')).toEqual(['a', 'b', 'c']);
    expect(parseFilter('It "should just" work "like expected').sort()).toEqual([
      'It',
      'like expected',
      'should just',
      'work',
    ]);
    expect(parseFilter('"A"d"B"e"C"')).toEqual(['A', 'B', 'C', 'd', 'e']);
  });
});
