import chai, { assert } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Decimal from 'decimal.js-light';
import { mount, shallow } from 'enzyme';
import firebase from 'firebase';
import React from 'react';
import sinon from 'sinon';
import uuid from 'uuid';

import App from '../src/App';
import LoonyInternalError from '../src/LoonyInternalError';
import Transaction from '../src/Transaction';
import TransactionRow from '../src/TransactionRow';
import firebaseConfig from '../src/firebaseConfig';

chai.use(chaiAsPromised);
firebase.initializeApp(firebaseConfig);

describe('<App />', function () {
  let sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  const stubGetRef = () => {
    const prefix = `AppTest/${uuid.v4()}`;
    const getRef = path => firebase.database().ref(`${prefix}/${path}`);
    sandbox.stub(App, 'getRef', getRef);
    return prefix;
  };

  const cleanUp = (path) => {
    firebase.database().ref(path).remove();
  };

  describe('#componentDidMount', function () {
    it('fetches transactions from Firebase', function () {
      const prefix = stubGetRef();

      const tx = new Transaction({
        dateMs: 12345,
        amountMinor: new Decimal('100000'),
        memo: 'hello',
      });
      const ref = App.budgetRef().child('transactions');
      const key = ref.push().key;
      tx.id = key;

      const expectedState = {
        transactions: {
          [key]: {
            id: key,
            account: '',
            dateMs: 12345,
            payee: '',
            category: '',
            memo: 'hello',
            amountMinor: new Decimal('100000'),
          },
        },
      };

      const wrapper = shallow(<App />);
      const app = wrapper.instance();

      const p = ref.child(key).set(tx.firebaseData())
        .then(() => app.componentDidMount())
        .then(() => {
          assert.deepEqual(wrapper.state(), expectedState);
          cleanUp(prefix);
        })
        .catch((error) => {
          cleanUp(prefix);
          assert(false, `App.componentDidMount failed: ${error}`);
        });

      return assert.isFulfilled(p);
    });
  });

  describe('#addTransaction', function () {
    it('should add a new transaction to state', function () {
      const prefix = stubGetRef();

      const wrapper = shallow(<App />);
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
          cleanUp(prefix);
        })
        .catch((error) => {
          assert(false, `addTransaction failed: ${error}`);
          cleanUp(prefix);
        });

      return assert.isFulfilled(p);
    });

    it('should add a new TransactionRow', function () {
      const prefix = stubGetRef();

      const wrapper = mount(<App />);
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
          cleanUp(prefix);
        })
        .catch((error) => {
          assert(false, `addTransaction failed: ${error}`);
          cleanUp(prefix);
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
      const wrapper = shallow(<App />);
      wrapper.setState({ transactions });
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
      const wrapper = shallow(<App />);
      wrapper.setState({ transactions });
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
      const wrapper = shallow(<App />);
      wrapper.setState({ transactions });
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
      const wrapper = mount(<App />);
      wrapper.setState({ transactions });
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
