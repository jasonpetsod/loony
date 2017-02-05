import { assert } from 'chai';
import { mount } from 'enzyme';
import 'jsdom-global/register';  // global.document
import React from 'react';

import MutableTransactionRow from '../src/MutableTransactionRow';

describe('<MutableTransactionRow />', function () {
  const createWrapper = (props) => {
    const defaultProps = {
      submitHandler: () => {},
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

  describe('renders', function () {
    const validateFields = (wrapper, expectedFields) => {
      const fields = {};
      wrapper.find('input').forEach((i) => {
        const node = i.getNode();
        fields[node.name] = node.value;
      });
      assert.deepEqual(fields, expectedFields);
    };

    it('without initialTransactionData', function () {
      const wrapper = createWrapper();

      const expectedFields = {
        account: '',
        // TODO: Stub out default date.
        date: '2017-02-05',
        payee: '',
        category: '',
        memo: '',
        outflow: '',
        inflow: '',
        submit: 'Submit',
      };
      validateFields(wrapper, expectedFields);
    });

    it('with initialTransactionData', function () {
      // TODO: Create a unified Transaction type.
      const initialTransactionData = {
        id: '',
        dateMs: 1483228800000,  // 2017-01-01 00:00:00 UTC
        account: 'Cash',
        payee: 'Mu Ramen',
        category: 'Restaurants',
        memo: 'yay noodles',
        outflow: 23,
        inflow: 19.89,
      };
      const wrapper = createWrapper({ initialTransactionData });

      const expectedFields = {
        account: 'Cash',
        date: '2017-01-01',
        payee: 'Mu Ramen',
        category: 'Restaurants',
        memo: 'yay noodles',
        // TODO: This should be 23.00.
        outflow: '23',
        inflow: '19.89',
        submit: 'Submit',
      };
      validateFields(wrapper, expectedFields);
    });
  });

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
      // TODO: Create a unified Transaction type.
      const initialTransactionData = {
        id: '',
        dateMs: 1483228800000,  // 2017-01-01 00:00:00 UTC
        account: 'Cash',
        payee: 'Mu Ramen',
        category: 'Restaurants',
        memo: 'yay noodles',
        outflow: 23,
        inflow: 19.89,
      };

      let receivedData = null;
      const handler = (data) => { receivedData = data; };
      const wrapper = createWrapper({
        initialTransactionData,
        submitHandler: handler,
      });

      // Edit fields.
      const newFields = {
        date: '2017-01-03',
        account: 'Chase Sapphire Reserved',
        payee: 'Hi-Collar',
        category: 'Alcohol',
        memo: 'yay sake',
        outflow: '100.00',
        inflow: '200.00',
      };
      setFields(wrapper, newFields);

      // Click submit.
      wrapper.find('input[type="submit"]').simulate('click');

      // Make sure handler() is called with the right data.
      const expectedData = {
        id: '',
        dateMs: 1483401600000,  // 2017-01-03 00:00:00 UTC
        account: 'Chase Sapphire Reserved',
        payee: 'Hi-Collar',
        category: 'Alcohol',
        memo: 'yay sake',
        outflow: 100,
        inflow: 200,
      };
      assert.deepEqual(receivedData, expectedData);
    });
  });
});
