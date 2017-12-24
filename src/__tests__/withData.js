import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';

import withData from '../withData';

describe('withData', () => {
  it('should return a decorator function', () => {
    expect(withData).toBeA('function');
  });

  it('should render without error', () => {
    const render = () => {
      const Div = () => <div />;
      const WithData = withData()(Div);
      const dom = TestUtils.renderIntoDocument(<WithData />);
      return dom;
    };
    expect(render).toNotThrow();
  });
});
