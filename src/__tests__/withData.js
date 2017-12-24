import expect from 'expect';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';

import withData from '../withData';

const render = ({ component, options, attributes }) => {
  const WithData = withData(options)(component);
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

  describe('filtering', () => {
    it.only('should filter the data', () => {
      class Div extends Component {
        render() {
          return <div />;
        }
      }
      const options = {
        initial: {
          data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          columns: [{ id: 'num', filter: f => v => v % f === 0 }],
          filter: '2',
        },
      };
      const { dom } = render({ component: Div, options });
      const { props } = TestUtils.findRenderedComponentWithType(dom, Div);
      console.log(props);
      expect(props.data).toBeA('array');
      expect(props.data).toEqual([0, 2, 4, 6, 8]);
    });
  });
});
