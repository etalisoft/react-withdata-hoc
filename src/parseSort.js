import { isBool, toArray } from './helpers';

export default (value, curSort, rawColumns) => {
  return !value ? undefined : toArray(value).map(Sort);

  function Sort(v) {
    const sort = typeof v === 'string' ? { column: v } : v;
    sort.ascending = isAscending(sort);
    return sort;
  }

  function isAscending({ column, ascending }) {
    if (isBool(ascending)) {
      return ascending;
    }

    if (curSort) {
      const cur = curSort.find(s => s.column === column);
      if (cur) {
        return !cur.ascending;
      }
    }

    if (rawColumns) {
      const col = rawColumns.find(c => c.id === column);
      if (col && isBool(col.ascending)) {
        return col.ascending;
      }
    }

    return true;
  }
};
