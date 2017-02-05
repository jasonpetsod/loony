import { assert } from 'chai';
import { mount, shallow } from 'enzyme';
import 'jsdom-global/register';
import React from 'react';

import App from '../src/App';
import LoonyInternalError from '../src/LoonyInternalError';
import TransactionRow from '../src/TransactionRow';

describe('<App />', function () {
  describe('#addTransaction', function () {
    it('should add a new transaction to state', function () {
      const transactions = {
        a: {
          id: 'a',
          dateMs: 1483246800000,  // 2017-01-01 00:00 UTC-05:00
          account: 'Checking',
          payee: 'Google Inc.',
          category: 'Income for January',
          memo: '',
          outflow: 0,
          inflow: 100.00,
        },
        b: {
          id: 'b',
          dateMs: 1483678800000,  // 2017-01-06 00:00 UTC-05:00
          account: 'Cash',
          payee: 'Raku',
          category: 'Restaurants',
          memo: '',
          outflow: 27.31,
          inflow: 0,
        },
      };
      const wrapper = shallow(<App transactions={transactions} />);
      const app = wrapper.instance();

      const newTransaction = {
        id: 'c',
        dateMs: 1483938000000,  // 2017-01-09 00:00 UTC-05:00
        account: 'Chase Sapphire Reserve',
        payee: 'Ippudo',
        category: 'Restaurants',
        memo: '',
        outflow: 27.31,
        inflow: 0,
      };

      app.addTransaction(newTransaction);

      assert.equal(wrapper.state().transactions.c, newTransaction);
      assert.sameMembers(
        Object.keys(wrapper.state().transactions),
        ['a', 'b', 'c']);
    });

    it('should add a new TransactionRow', function () {
      const transactions = {};
      const wrapper = mount(<App transactions={transactions} />);
      const app = wrapper.instance();

      const newTransaction = {
        id: 'c',
        dateMs: 1483938000000,  // 2017-01-09 00:00 UTC-05:00
        account: 'Chase Sapphire Reserve',
        payee: 'Ippudo',
        category: 'Restaurants',
        memo: '',
        outflow: 27.31,
        inflow: 0,
      };

      assert.lengthOf(wrapper.find(TransactionRow), 0);

      app.addTransaction(newTransaction);

      const rows = wrapper.find(TransactionRow);
      assert.lengthOf(rows, 1);
      const transaction = rows.at(0).prop('transaction');
      assert.equal(transaction.id, 'c');
    });
  });

  describe('#editTransaction', function () {
    it('should edit the transaction in state', function () {
      const transactions = {
        a: {
          id: 'a',
          dateMs: 1483246800000,  // 2017-01-01 00:00 UTC-05:00
          account: 'Checking',
          payee: 'Google Inc.',
          category: 'Income for January',
          memo: '',
          outflow: 0,
          inflow: 100.00,
        },
      };
      const wrapper = shallow(<App transactions={transactions} />);
      const app = wrapper.instance();

      const newTransaction = {
        id: 'a',
        dateMs: 1483938000000,  // 2017-01-09 00:00 UTC-05:00
        account: 'Chase Sapphire Reserve',
        payee: 'Ippudo',
        category: 'Restaurants',
        memo: '',
        outflow: 27.31,
        inflow: 0,
      };

      app.editTransaction('a', newTransaction);

      assert.equal(wrapper.state().transactions.a, newTransaction);
      assert.sameMembers(Object.keys(wrapper.state().transactions), ['a']);
    });

    it('should fail when the id does not exist', function () {
      const transactions = {};
      const wrapper = shallow(<App transactions={transactions} />);
      const app = wrapper.instance();

      const newTransaction = {
        id: 'a',
        dateMs: 1483938000000,  // 2017-01-09 00:00 UTC-05:00
        account: 'Chase Sapphire Reserve',
        payee: 'Ippudo',
        category: 'Restaurants',
        memo: '',
        outflow: 27.31,
        inflow: 0,
      };

      assert.throws(
        () => { app.editTransaction('a', newTransaction); },
        LoonyInternalError, /no transaction with ID/);
    });

    it('ensures id parameter matches id in transaction', function () {
      const transactions = {};
      const wrapper = shallow(<App transactions={transactions} />);
      const app = wrapper.instance();

      const newTransaction = {
        id: 'a',
        dateMs: 1483938000000,  // 2017-01-09 00:00 UTC-05:00
        account: 'Chase Sapphire Reserve',
        payee: 'Ippudo',
        category: 'Restaurants',
        memo: '',
        outflow: 27.31,
        inflow: 0,
      };

      assert.throws(
        () => { app.editTransaction('zzz', newTransaction); },
        LoonyInternalError, /id does not match transaction.id/);
    });

    it('should edit the existing TransactionRow', function () {
      const transactions = {
        a: {
          id: 'a',
          dateMs: 1483246800000,  // 2017-01-01 00:00 UTC-05:00
          account: 'Checking',
          payee: 'Google Inc.',
          category: 'Income for January',
          memo: '',
          outflow: 0,
          inflow: 100.00,
        },
      };
      const wrapper = mount(<App transactions={transactions} />);
      const app = wrapper.instance();

      const newTransaction = {
        id: 'a',
        dateMs: 1483938000000,  // 2017-01-09 00:00 UTC-05:00
        account: 'Chase Sapphire Reserve',
        payee: 'Ippudo',
        category: 'Restaurants',
        memo: '',
        outflow: 27.31,
        inflow: 0,
      };

      app.editTransaction('a', newTransaction);

      const rows = wrapper.find(TransactionRow);
      assert.lengthOf(rows, 1);
      const transaction = rows.at(0).prop('transaction');
      assert.deepEqual(transaction, newTransaction);
    });
  });
});
