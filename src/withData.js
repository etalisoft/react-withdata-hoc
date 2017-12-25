import React, { Component } from 'react';
import PropTypes from 'prop-types';

import defaults from './withData.defaults';

import { toArray } from './helpers';
import throttle from './throttle';

export default (options = {}) => BaseComponent => {
  const initial = {
    ...defaults.initial,
    ...options.initial,
  };
  const parseFilter = options.parseFilter || defaults.parseFilter;
  const parseSort = options.parseSort || defaults.parseSort;
  const ms = options.throttle || defaults.throttle;

  class WithData extends Component {
    state = {
      columns: initial.columns,
      data: initial.data,
      filter: parseFilter(initial.filter),
      sort: parseSort(initial.sort, undefined, initial.columns),
      page: initial.page,
      pageSize: initial.pageSize,
    };

    componentWillMount() {
      this.updateData();
      this.throttledUpdate = throttle({ ms })(this.updateData.bind(this));
    }

    componentDidUpdate(prevProps, prevState) {
      if (
        this.props.data !== prevProps.data ||
        this.props.columns !== prevProps.columns ||
        this.state.sort != prevState.sort ||
        this.state.filter != prevState.filter ||
        this.state.page != prevState.page ||
        this.state.pageSize != prevState.pageSize
      ) {
        this.throttledUpdate();
      }
    }

    updateData() {
      const { data: rawData, columns: rawColumns } = this.props;
      let columns = rawColumns;
      let data = rawData;
      let pages = undefined;
      let other = {};

      // TODO: filter columns
      // TODO: sort columns

      if (data) {
        // Filter data
        const { filter } = this.state;
        if (filter) {
          const fn = o => toArray(filter).every(f => columns.some(c => c.filter && c.filter(f)(o)));
          data = data.filter(fn);
        }

        // Sort data
        const { sort } = this.state;
        if (sort) {
          const sorts = toArray(sort).reduce((arr, { column: id, ascending }) => {
            const column = rawColumns.find(c => c.id === id);
            if (column && column.sort) {
              arr.push({ srt: column.sort, dir: ascending ? 1 : -1 });
            }
            return arr;
          }, []);
          if (sorts.length) {
            const fn = (a, b) => sorts.reduce((r, { srt, dir }) => (!r ? srt(a, b) * dir : r), 0);
            data = [...data].sort(fn);
          }
        }

        // Paginate data
        const { pageSize, page } = this.state;
        other.maxPage = other.page = 0;
        pages = [data];
        if (pageSize >= 0 && data.length > pageSize) {
          other.maxPage = Math.max(Math.ceil(data.length / pageSize) - 1, 0);
          other.page = Math.max(Math.min(page, other.maxPage), 0);
          pages = [];
          for (var i = 0; i < data.length; i += pageSize) {
            pages.push(data.slice(i, i + pageSize));
          }
          data = pages[other.page];
        }
      }

      this.setState({
        columns,
        data,
        pages,
        ...other,
      });
    }

    setFilter = filter => {
      this.setState({
        filter: parseFilter(filter),
      });
    };

    setSort = sort => {
      this.setState({
        sort: parseSort(sort, this.state.sort, this.props.columns),
      });
    };

    setPage = page => {
      // TODO: constrain page to valid values
      this.setState({ page });
    };

    setPageSize = pageSize => {
      this.setState({ pageSize });
    };

    setColumn = column => {
      // TODO: ColumnSetting :: { id:string, [priority:number], [visible:bool] }
      // TODO: ColumnSetting or Array<ColumnSetting>
      const { columns: rawColumns } = this.props;
      const { columnsConfig } = this.state;
      // TODO: filter/sort rawColumns using columnsConfig
      const columns = columnsConfig;
      this.setState({ columns });
    };

    render() {
      const { data: rawData, columns: rawColumns, ...props } = this.props;
      const { columnsConfig, ...state } = this.state;
      const empty = !rawData;

      return (
        <BaseComponent
          {...state}
          {...props}
          rawData={rawData}
          rawColumns={rawColumns}
          empty={empty}
          setFilter={this.setFilter}
          setSort={this.setSort}
          setPage={this.setPage}
          setPageSize={this.setPageSize}
        />
      );
    }
  }

  WithData.propTypes = {
    data: PropTypes.array,
    columns: PropTypes.array,
  };

  WithData.defaultProps = {
    data: initial.data,
    columns: initial.columns,
  };

  return WithData;
};
