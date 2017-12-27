import { isBool, toArray } from './helpers';

export default (value, curColumns, rawColumns) => {
  return !value ? undefined : toArray(value).map(Column);

  function Column(c, index) {
    c.visible = get({ key: 'visible', type: 'boolean', defaultValue: true })(c);
    c.priority = get({ key: 'priority', type: 'number', defaultValue: index })(c);
    return c;
  }

  function get({ key, type, defaultValue }) {
    return current => {
      if (typeof current[key] === type) {
        return current[key];
      }

      if (curColumns) {
        const cur = curColumns.find(c => c.column === current.column);
        if (cur) {
          return cur[key];
        }
      }

      if (rawColumns) {
        const raw = rawColumns.find(c => c.id === current.column);
        if (raw && typeof raw[key] === type) {
          return raw[key];
        }
        if (raw && key === 'priority') {
          return rawColumns.indexOf(raw);
        }
      }

      return defaultValue;
    };
  }
};
