import { assert } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import MutableTransactionRow from '../src/MutableTransactionRow';
import Transaction from '../src/Transaction';
import errors from '../src/errors';

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
        amountMinor: -2300,
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
        inflow: '0',
        submit: 'Submit',
      };
      validateFields(wrapper, expectedFields);
    });
  });

  describe('#parseAmountMinor', function () {
    it('fails if both inflow and outflow are given', function () {
      assert.throws(
        () => { MutableTransactionRow.parseAmountMinor('100.00', '200.30'); },
        errors.ParseError, /Both outflow.*and inflow.* can't be given/);
    });

    it('fails if inflow is negative', function () {
      assert.throws(
        () => { MutableTransactionRow.parseAmountMinor('-100.30', ''); },
        errors.ParseError, /inflow can't be negative.*/);
    });

    it('fails if outflow is negative', function () {
      assert.throws(
        () => { MutableTransactionRow.parseAmountMinor('', '-100.30'); },
        errors.ParseError, /outflow can't be negative.*/);
    });

    it('fails if inflow is not a number', function () {
      assert.throws(
        () => { MutableTransactionRow.parseAmountMinor('hello', ''); },
        errors.ParseError, /inflow is not a number: hello/);
    });

    it('fails if outflow is not a number', function () {
      assert.throws(
        () => { MutableTransactionRow.parseAmountMinor('', 'hello'); },
        errors.ParseError, /outflow is not a number: hello/);
    });

    it('parses valid inflow and empty outflow', function () {
      const result = MutableTransactionRow.parseAmountMinor('100.30', '');
      assert.equal(result, 10030);
    });

    it('parses valid inflow and zero outflow', function () {
      const result = MutableTransactionRow.parseAmountMinor('100.30', '0');
      assert.equal(result, 10030);
    });

    it('parses empty inflow and valid outflow', function () {
      const result = MutableTransactionRow.parseAmountMinor('', '100.30');
      assert.equal(result, -10030);
    });

    it('parses zero inflow and valid outflow', function () {
      const result = MutableTransactionRow.parseAmountMinor('0', '100.30');
      assert.equal(result, -10030);
    });
  });  // #parseAmountMinor

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
        inflow: '0',
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
        amountMinor: -2300,
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
        amountMinor: -2300,
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
        inflow: '0',
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
        amountMinor: -10000,
      };
      assert.deepEqual(receivedData, expectedData);
    });
  });
});
