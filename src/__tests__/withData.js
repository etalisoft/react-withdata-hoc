import expect from 'expect';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';

import withData from '../withData';

const render = ({ component, config, attributes }) => {
  const WithData = withData(config)(component);
  const dom = TestUtils.renderIntoDocument(<WithData {...attributes} />);
  return { dom };
};

describe('withData', () => {
  it('should return a decorator function', () => {
    expect(withData).toBeA('function');
  });

  it('should render without error', () => {
    const Div = () => <div />;
    expect(() => render({ component: Div })).toNotThrow();
  });

  it('should provide the correct props', () => {
    class Div extends Component {
      render() {
        return <div />;
      }
    }
    const { dom } = render({ component: Div });
    const props = TestUtils.findRenderedComponentWithType(dom, Div).props;
    expect(Object.keys(props).sort()).toEqual([
      'columns',
      'data',
      'empty',
      'filter',
      'page',
      'pageSize',
      'pages',
      'rawColumns',
      'rawData',
      'setFilter',
      'setPage',
      'setPageSize',
      'setSort',
      'sort',
    ]);
  });
});
