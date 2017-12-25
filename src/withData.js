import React, { Component } from 'react';
import PropTypes from 'prop-types';

import defaults from './withData.defaults';

const bool = v => typeof v === 'boolean';

export default (options = {}) => BaseComponent => {
  const initial = {
    ...defaults.initial,
    ...options.initial,
  };
  const parseFilter = options.parseFilter || defaults.parseFilter;

  class WithData extends Component {
    state = {
      columns: initial.columns,
      data: initial.data,
      filter: initial.filter,
      sort: initial.sort,
      page: initial.page,
      pageSize: initial.pageSize,
    };

    componentWillMount() {
      this.updateData();
      // TODO: create a throttled version of updatedata
    }

    componentDidUpdate(prevProps, prevState) {
      // TODO: Call the throttled version of update data only when needed
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
          const parsed = parseFilter(filter);
          if (parsed) {
            const filters = parsed instanceof Array ? parsed : [parsed];
            const fn = o => filters.every(f => columns.some(c => c.filter && c.filter(f)(o)));
            data = data.filter(fn);
          }
        }

        // Sort data
        const { sort } = this.state;
        if (sort) {
          const sorts = sort.reduce((arr, { column: id, ascending: asc }) => {
            const column = rawColumns.find(c => c.id === id);
            if (column && column.sort) {
              const ascending = bool(asc) ? asc : bool(column.ascending) ? column.ascending : true;
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
      this.setState({ filter });
    };

    setSort = sort => {
      // TODO: parse sorts (string / {column:string,ascending:bool})
      // TODO: Support custom sort parser
      this.setState({ sort });
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
