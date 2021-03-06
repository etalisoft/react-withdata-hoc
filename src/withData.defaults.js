import parseColumn from './parseColumn';
import parseFilter from './parseFilter';
import parseSort from './parseSort';

export default {
  initial: {
    data: undefined,
    columns: undefined,
    sort: undefined,
    filter: undefined,
    page: 0,
    pageSize: 10,
  },
  parseColumn,
  parseFilter,
  parseSort,
  throttle: 250,
};
