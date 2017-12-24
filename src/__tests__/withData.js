import expect from 'expect';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';

import withData from '../withData';

class Div extends Component {
  render() {
    return <div />;
  }
}
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
    expect(() => render({ component: Div })).toNotThrow();
  });

  it('should provide the correct props', () => {
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
    it('should filter the data', () => {
      const options = {
        initial: {
          data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          columns: [{ id: 'num', filter: f => v => v % f === 0 }],
          filter: '2',
        },
      };
      const { dom } = render({ component: Div, options });
      const { props } = TestUtils.findRenderedComponentWithType(dom, Div);
      expect(props.data).toBeA('array');
      expect(props.data).toEqual([0, 2, 4, 6, 8]);
    });

    it('should parse the filter', () => {
      const options = {
        initial: {
          columns: [
            { id: 'id', filter: f => o => `${o.id}`.includes(f) },
            { id: 'name', filter: f => o => `${o.name.first} ${o.name.last}`.toLowerCase().includes(f) },
          ],
          data: [
            { id: 123, name: { first: 'Bob', last: 'Smith' } },
            { id: 456, name: { first: 'Joe', last: 'Smith' } },
            { id: 102, name: { first: 'Smithy', last: 'Black' } },
          ],
          filter: '2 "mi"',
        },
      };
      const { dom } = render({ component: Div, options });
      const { props } = TestUtils.findRenderedComponentWithType(dom, Div);
      expect(props.data).toBeA('array');
      const expected = [options.initial.data[0], options.initial.data[2]];
      expect(JSON.stringify(props.data)).toEqual(JSON.stringify(expected));
    });
  });
});
