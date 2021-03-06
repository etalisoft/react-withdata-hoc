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
      if (prevProps.data !== this.props.data || prevProps.columns !== this.props.columns) {
        this.throttledUpdate();
      }
    }

    updateData() {
      const { data: rawData } = this.props;
      const { columns: curColumns, filter, sort, pageSize, page: curPage } = this.state;
      console.groupCollapsed('updateData');
      console.log({ curColumns, rawColumns: this.props.columns });
      const colEnum = new Enumerable(parseColumn(undefined, curColumns, this.props.columns));
      console.log('parseColumn', parseColumn(undefined, curColumns, this.props.columns));
      const rawColumns = colEnum.toArray();
      const columns = colEnum
        .where(c => c.visible)
        .orderBy((a, b) => a.priority - b.priority)
        .toArray();
      console.log({ RAW: rawColumns, COL: columns });
      console.groupEnd('updateData');
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
        if (pageSize >= 0) {
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
        rawColumns,
        columns,
        data,
        pages,
        ...other,
      });
    }

    setFilter = filter => {
      this.setState({ filter }, this.throttledUpdate);
    };

    setSort = sort => {
      this.setState(
        {
          sort: parseSort(sort, this.state.sort, this.props.columns),
        },
        this.throttledUpdate
      );
    };

    setPage = page => {
      this.setState({ page }, this.throttledUpdate);
    };

    setPageSize = pageSize => {
      this.setState({ pageSize }, this.throttledUpdate);
    };

    setColumn = column => {
      console.groupCollapsed('setColumn');
      console.log('parseColumn', { column, curColumns: this.state.columns, rawColumns: this.props.columns });
      const columns = parseColumn(column, this.state.columns, this.props.columns);
      console.log('=', columns);
      this.setState({ columns }, this.throttledUpdate);
      console.groupEnd('setColumn');
    };

    render() {
      const { data: rawData, ...props } = this.props;
      const { columns, rawColumns, data, filter, sort, page, pageSize, pages } = this.state;
      const empty = !rawData;

      return (
        <BaseComponent
          {...props}
          rawData={rawData}
          rawColumns={rawColumns}
          columns={columns}
          data={data}
          filter={filter}
          sort={sort}
          page={page}
          pageSize={pageSize}
          pages={pages}
          empty={empty}
          setColumn={this.setColumn}
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
