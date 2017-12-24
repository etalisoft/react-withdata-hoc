import parseFilter from './parseFilter';

export default {
  initial: {
    data: undefined,
    columns: undefined,
    sort: undefined,
    filter: undefined,
    page: 0,
    pageSize: 10,
  },
  parseFilter,
};
