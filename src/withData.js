import React, { Component } from 'react';
import PropTypes from 'prop-types';

import defaults from './withData.defaults';

export default (options = {}) => BaseComponent => {
  const initial = {
    ...defaults.initial,
    ...options.initial,
  };

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
      let pages = [rawData];
      let other = {};

      // TODO: filter columns
      // TODO: sort columns

      // TODO: filter data
      // TODO: sort data
      // TODO: paginate data

      this.setState({
        columns,
        data,
        pages,
        ...other,
      });
    }

    setFilter = filter => {
      // TODO: parse filters (Ex1 "Ex2 Ex3" Ex4)
      // TODO: Support custom filter parser
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
