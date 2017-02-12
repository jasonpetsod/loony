import { assert } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import MutableTransactionRow from '../src/MutableTransactionRow';
import Transaction from '../src/Transaction';

describe('<MutableTransactionRow />', function () {
  let sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  const createWrapper = (props) => {
    const defaultProps = {
      submitHandler: () => {},
      submitButtonLabel: 'Submit',
      initialTransaction: null,
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

    it('without initialTransaction', function () {
      const getDateStub = sandbox.stub(MutableTransactionRow, 'getDate');
      getDateStub.returns('2017-01-01');

      const wrapper = createWrapper();

      const expectedFields = {
        account: '',
        date: '2017-01-01',
        payee: '',
        category: '',
        memo: '',
        outflow: '',
        inflow: '',
        submit: 'Submit',
      };
      validateFields(wrapper, expectedFields);
    });

    it('with initialTransaction', function () {
      const initialTransaction = new Transaction({
        id: 'a',
        dateMs: 1483228800000,  // 2017-01-01 00:00:00 UTC
        account: 'Cash',
        payee: 'Mu Ramen',
        category: 'Restaurants',
        memo: 'yay noodles',
        outflow: 23,
        inflow: 19.89,
      });
      const wrapper = createWrapper({ initialTransaction });

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
      assert.lengthOf(field, 1, `Couldn't find field: ${name}`);
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

    it('without initialTransaction', function () {
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
        id: null,
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

    it('with initialTransaction', function () {
      const initialTransaction = new Transaction({
        id: 'a',
        dateMs: 1483228800000,  // 2017-01-01 00:00:00 UTC
        account: 'Cash',
        payee: 'Mu Ramen',
        category: 'Restaurants',
        memo: 'yay noodles',
        outflow: 23,
        inflow: 19.89,
      });

      let receivedData = null;
      const handler = (data) => { receivedData = data; };
      const wrapper = createWrapper({
        initialTransaction,
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
        id: 'a',
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
