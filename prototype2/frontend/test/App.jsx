import { assert } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import App from '../src/App';

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

      // FIXME: Accessing app.state directly is racy since setState only
      // enqueues a state change.

      assert.equal(app.state.transactions.c, newTransaction);
      assert.sameMembers(
        Object.keys(app.state.transactions),
        ['a', 'b', 'c']);
    });

    it('should add a new row to TransactionTable');
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

      // FIXME: Accessing app.state directly is racy since setState only
      // enqueues a state change.

      assert.equal(app.state.transactions.a, newTransaction);
      assert.sameMembers(Object.keys(app.state.transactions), ['a']);
    });

    it('should fail when the id does not exist');

    it('ensures id parameter matches id in transaction');

    it('should edit the existing transaction in TransactionTable');
  });
});
