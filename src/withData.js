import React, { Component } from 'react';
import PropTypes from 'prop-types';

import defaults from './withData.defaults';

import Enumerable from './Enumerable';
import { toArray } from './helpers';
import throttle from './throttle';

export default (options = {}) => BaseComponent => {
  const initial = {
    ...defaults.initial,
    ...options.initial,
  };
  const parseColumn = options.parseColumn || defaults.parseColumn;
  const parseFilter = options.parseFilter || defaults.parseFilter;
  const parseSort = options.parseSort || defaults.parseSort;
  const ms = options.throttle || defaults.throttle;

  class WithData extends Component {
    state = {
      columns: parseColumn(undefined, undefined, initial.columns),
      data: initial.data,
      filter: initial.filter,
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
      const { columns: curColumns, filter, sort, pageSize, page: curPage } = this.state;
      let columns = new Enumerable(parseColumn(undefined, curColumns, rawColumns))
        .where(c => c.visible)
        .orderBy((a, b) => a.priority - b.priority)
        .toArray();
      let data = rawData;
      let pages = undefined;
      let other = {};

      if (rawData) {
        const enumerable = new Enumerable(rawData);

        // Filter data
        if (filter) {
          const parsed = parseFilter(filter);
          if (parsed) {
            const fn = o => toArray(parsed).every(f => columns.some(c => c.filter && c.filter(f)(o)));
            enumerable.where(fn);
          }
        }

        // Sort data
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
            enumerable.orderBy(fn);
          }
        }

        // Paginate data
        data = enumerable.toArray();
        pages = [data];
        if (pageSize >= 0 && data.length > pageSize) {
          other.maxPage = Math.max(Math.ceil(data.length / pageSize) - 1, 0);
          other.page = Math.max(Math.min(curPage, other.maxPage), 0);
          pages = new Enumerable(data).partition(pageSize).toArray();
          data = enumerable
            .skip(other.page * pageSize)
            .take(pageSize)
            .toArray();
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
      this.setState({ filter });
    };

    setSort = sort => {
      this.setState({
        sort: parseSort(sort, this.state.sort, this.props.columns),
      });
    };

    setPage = page => {
      this.setState({ page });
    };

    setPageSize = pageSize => {
      this.setState({ pageSize });
    };

    setColumn = column => {
      this.setState({
        columns: parseColumn(column, this.state.columns, this.props.columns),
      });
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
