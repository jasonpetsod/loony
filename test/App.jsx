import chai, { assert } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Decimal from 'decimal.js-light';
import { mount, shallow } from 'enzyme';
import firebase from 'firebase';
import React from 'react';

import App from '../src/App';
import LoonyInternalError from '../src/LoonyInternalError';
import Transaction from '../src/Transaction';
import TransactionRow from '../src/TransactionRow';
import firebaseConfig from '../src/firebaseConfig';

chai.use(chaiAsPromised);

// TODO: Make these tests hermetic and clean up after themselves.
firebase.initializeApp(firebaseConfig);

describe('<App />', function () {
  describe('#addTransaction', function () {
    it('should add a new transaction to state', function () {
      const transactions = {};
      const wrapper = shallow(<App transactions={transactions} />);
      const app = wrapper.instance();

      const tx = new Transaction({
        dateMs: 1483938000000,  // 2017-01-09 00:00 UTC-05:00
        account: 'Chase Sapphire Reserve',
        payee: 'Ippudo',
        category: 'Restaurants',
        memo: '',
        outflow: new Decimal('27.31'),
        inflow: new Decimal('0'),
      });

      const p = app.addTransaction(tx)
        .then(() => {
          const expectedState = {
            transactions: {
              [tx.id]: tx,
            },
          };
          assert.deepEqual(wrapper.state(), expectedState);
        })
        .catch((error) => {
          assert(false, `addTransaction failed: ${error}`);
        });

      return assert.isFulfilled(p);
    });

    it('should add a new TransactionRow', function () {
      const transactions = {};
      const wrapper = mount(<App transactions={transactions} />);
      const app = wrapper.instance();

      const newTransaction = new Transaction({
        dateMs: 1483938000000,  // 2017-01-09 00:00 UTC-05:00
        account: 'Chase Sapphire Reserve',
        payee: 'Ippudo',
        category: 'Restaurants',
        outflow: new Decimal('27.31'),
      });

      const p = app.addTransaction(newTransaction)
        .then(() => {
          const rows = wrapper.find(TransactionRow);
          assert.lengthOf(rows, 1);
          const transaction = rows.at(0).prop('transaction');
          assert.deepEqual(transaction, newTransaction);
        })
        .catch((error) => {
          assert(false, `addTransaction failed: ${error}`);
        });

      return assert.isFulfilled(p);
    });
  });

  describe('#editTransaction', function () {
    it('should edit the transaction in state', function () {
      const transactions = {
        a: new Transaction({
          id: 'a',
          dateMs: 1483246800000,  // 2017-01-01 00:00 UTC-05:00
          account: 'Checking',
          payee: 'Google Inc.',
          category: 'Income for January',
          inflow: new Decimal('100.00'),
        }),
      };
      const wrapper = shallow(<App transactions={transactions} />);
      const app = wrapper.instance();

      const newTransaction = new Transaction({
        id: 'a',
        dateMs: 1483938000000,  // 2017-01-09 00:00 UTC-05:00
        account: 'Chase Sapphire Reserve',
        payee: 'Ippudo',
        category: 'Restaurants',
        outflow: new Decimal('27.31'),
      });

      app.editTransaction('a', newTransaction);

      assert.equal(wrapper.state().transactions.a, newTransaction);
      assert.sameMembers(Object.keys(wrapper.state().transactions), ['a']);
    });

    it('should fail when the id does not exist', function () {
      const transactions = {};
      const wrapper = shallow(<App transactions={transactions} />);
      const app = wrapper.instance();

      const newTransaction = new Transaction({
        id: 'a',
        dateMs: 1483938000000,  // 2017-01-09 00:00 UTC-05:00
        account: 'Chase Sapphire Reserve',
        payee: 'Ippudo',
        category: 'Restaurants',
        outflow: new Decimal('27.31'),
      });

      assert.throws(
        () => { app.editTransaction('a', newTransaction); },
        LoonyInternalError, /no transaction with ID/);
    });

    it('ensures id parameter matches id in transaction', function () {
      const transactions = {};
      const wrapper = shallow(<App transactions={transactions} />);
      const app = wrapper.instance();

      const newTransaction = new Transaction({
        id: 'a',
        dateMs: 1483938000000,  // 2017-01-09 00:00 UTC-05:00
        account: 'Chase Sapphire Reserve',
        payee: 'Ippudo',
        category: 'Restaurants',
        outflow: new Decimal('27.31'),
      });

      assert.throws(
        () => { app.editTransaction('zzz', newTransaction); },
        LoonyInternalError, /id does not match transaction.id/);
    });

    it('should edit the existing TransactionRow', function () {
      const transactions = {
        a: new Transaction({
          id: 'a',
          dateMs: 1483246800000,  // 2017-01-01 00:00 UTC-05:00
          account: 'Checking',
          payee: 'Google Inc.',
          category: 'Income for January',
          inflow: new Decimal('100.00'),
        }),
      };
      const wrapper = mount(<App transactions={transactions} />);
      const app = wrapper.instance();

      const newTransaction = new Transaction({
        id: 'a',
        dateMs: 1483938000000,  // 2017-01-09 00:00 UTC-05:00
        account: 'Chase Sapphire Reserve',
        payee: 'Ippudo',
        category: 'Restaurants',
        outflow: new Decimal('27.31'),
      });

      app.editTransaction('a', newTransaction);

      const rows = wrapper.find(TransactionRow);
      assert.lengthOf(rows, 1);
      const transaction = rows.at(0).prop('transaction');
      assert.deepEqual(transaction, newTransaction);
    });
  });
});
