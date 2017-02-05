import { assert } from 'chai';
import { mount } from 'enzyme';
import 'jsdom-global/register';  // global.document
import React from 'react';

import MutableTransactionRow from '../src/MutableTransactionRow';

describe('<MutableTransactionRow />', function () {
  it('renders with initialTransactionData');
  it('renders without initialTransactionData');

  describe('handles submission', function () {
    const setField = (wrapper, name, value) => {
      const field = wrapper.find({ name });
      const event = {
        target: {
          name,
          value,
        },
      };
      field.simulate('change', event);
    };

    const setFields = (wrapper, fields) => {
      Object.keys(fields).forEach((name) => {
        setField(wrapper, name, fields[name]);
      });
    };

    const createWrapper = (props) => {
      const defaultProps = {
        submitButtonLabel: 'Submit',
        initialTransactionData: null,
      };
      const mergedProps = Object.assign(defaultProps, props);

      const options = {
        attachTo: global.document.createElement('tbody'),
      };
      const wrapper = mount(
        React.createElement(MutableTransactionRow, mergedProps), options);

      return wrapper;
    };

    it('without initialTransactionData', function () {
      let receivedData = null;
      const handler = (data) => { receivedData = data; };
      const wrapper = createWrapper({ submitHandler: handler });

      // Edit fields.
      const fields = {
        date: '2017-01-01',
        account: 'Cash',
        payee: 'Mu Ramen',
        category: 'Restaurants',
        memo: 'yay noodles',
        outflow: '23.00',
        inflow: '19.89',
      };
      setFields(wrapper, fields);

      // Click submit.
      wrapper.find('input[type="submit"]').simulate('click');

      // Make sure handler() is called with the right data.
      const expectedData = {
        id: '',
        dateMs: 1483228800000,
        account: 'Cash',
        payee: 'Mu Ramen',
        category: 'Restaurants',
        memo: 'yay noodles',
        outflow: 23,
        inflow: 19.89,
      };
      assert.deepEqual(receivedData, expectedData);
    });

    it('with initialTransactionData', function () {
    });
  });
});
