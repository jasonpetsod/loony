import chai, { assert } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Decimal from 'decimal.js-light';
import { mount, shallow } from 'enzyme';
import firebase from 'firebase';
import React from 'react';
import sinon from 'sinon';
import uuid from 'uuid';

import { newTx } from './transactionTestLib';
import App from '../src/App';
import LoonyInternalError from '../src/LoonyInternalError';
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

  // Wait for a sinon.Spy to be called, polling every 50 ms. No deadline;
  // Mocha will timeout the test after 2000 ms by default. (Each test's
  // timeout is configurable using this.timeout in a test context.)
  const waitForCall = spy => new Promise((resolve) => {
    const check = () => {
      if (spy.called) {
        resolve();
      }
      window.setTimeout(check, 250);
    };
    check();
  });

  describe('transactions/ listeners', function () {
    // TODO: Implement pending tests in this fixture.

    it('Firebase tx add should add it to state', function () {
      const prefix = stubGetRef();

      const tx = newTx({
        dateMs: 12345,
        amountMinor: new Decimal('100000'),
        memo: 'hello',
      });
      const txRef = App.budgetRef().child('transactions').push();
      const key = txRef.key;
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

      const spy = sandbox.stub(App, 'testOnlyTransactionAddedComplete');

      const wrapper = shallow(<App />);
      const app = wrapper.instance();

      const p = txRef.set(tx.firebaseData())
        .then(() => {
          app.componentDidMount();
          return waitForCall(spy);
        })
        .then(() => {
          assert.deepEqual(wrapper.state(), expectedState);
          cleanUp(prefix);
        })
        .catch((error) => {
          cleanUp(prefix);
          assert(false, `Promise rejected: ${error}`);
        });

      return assert.isFulfilled(p);
    });

    it('Multiple Firebase tx add should add multiple tx to state');
    it('Firebase tx add should add a TransactionRow');

    it('Firebase tx remove should remove it from state', function () {
      const prefix = stubGetRef();

      const tx = newTx({
        dateMs: 12345,
        amountMinor: new Decimal('100000'),
        memo: 'hello',
      });
      const txRef = App.budgetRef().child('transactions').push();

      const txAdded = sandbox.stub(App, 'testOnlyTransactionAddedComplete');
      const txRemoved = sandbox.stub(App, 'testOnlyTransactionRemovedComplete');

      const wrapper = shallow(<App />);
      const app = wrapper.instance();

      const p =
        txRef.set(tx.firebaseData())
        .then(() => {
          app.componentDidMount();
          return waitForCall(txAdded);
        })
        .then(() => txRef.remove())
        .then(() => waitForCall(txRemoved))
        .then(() => {
          assert.deepEqual(wrapper.state(), { transactions: {} });
          cleanUp(prefix);
        })
        .catch((error) => {
          cleanUp(prefix);
          assert(false, `Promise rejected: ${error}`);
        });

      return assert.isFulfilled(p);
    });

    it('Multiple Firebase tx remove should remove multiple tx from state');
    it('Firebase tx remove should remove a TransactionRow');

    it('Firebase tx change should change the tx in state', function () {
      const prefix = stubGetRef();

      const tx = newTx({
        dateMs: 12345,
        amountMinor: new Decimal('100000'),
        memo: 'hello',
      });
      const txRef = App.budgetRef().child('transactions').push();
      const key = txRef.key;

      const expectedState = {
        transactions: {
          [key]: {
            id: key,
            account: '',
            dateMs: 12345,
            payee: '',
            category: '',
            memo: 'goodbye',
            amountMinor: new Decimal('-1500'),
          },
        },
      };

      const txAdded = sandbox.stub(App, 'testOnlyTransactionAddedComplete');
      const txChanged = sandbox.stub(App, 'testOnlyTransactionChangedComplete');

      const wrapper = shallow(<App />);
      const app = wrapper.instance();

      const p = txRef.set(tx.firebaseData())
        .then(() => {
          app.componentDidMount();
          return waitForCall(txAdded);
        })
        .then(() => {
          const updates = {
            memo: 'goodbye',
            amountMinor: -1500,
          };
          return txRef.update(updates);
        })
        .then(() => waitForCall(txChanged))
        .then(() => {
          assert.deepEqual(wrapper.state(), expectedState);
          cleanUp(prefix);
        })
        .catch((error) => {
          cleanUp(prefix);
          assert(false, `Promise rejected: ${error}`);
        });

      return assert.isFulfilled(p);
    });

    it('Multiple Firebase tx change should change multiple tx in state');
    it('Firebase tx change should change the TransactionRow');
  });  // transactions/ listeners

  describe('#addTransaction', function () {
    it('should add a new transaction to state', function () {
      const prefix = stubGetRef();

      const spy = sandbox.stub(App, 'testOnlyTransactionAddedComplete');

      const wrapper = shallow(<App />);
      const app = wrapper.instance();
      app.componentDidMount();

      const tx = newTx({
        dateMs: 12345,
        amountMinor: new Decimal('999'),
        memo: 'hello',
      });

      let expectedState;
      const p =
        app.addTransaction(tx)
        .then((ref) => {
          tx.id = ref.key;
          expectedState = {
            transactions: {
              [ref.key]: {
                id: ref.key,
                account: '',
                dateMs: 12345,
                payee: '',
                category: '',
                memo: 'hello',
                amountMinor: new Decimal('999'),
              },
            },
          };
          return waitForCall(spy);
        })
        .then(() => {
          assert.deepEqual(wrapper.state(), expectedState);
          cleanUp(prefix);
        })
        .catch((error) => {
          cleanUp(prefix);
          assert(false, `addTransaction failed: ${error}`);
        });

      return assert.isFulfilled(p);
    });
  });  // #addTransaction

  describe('#editTransaction', function () {
    it('should edit the transaction in state', function () {
      const transactions = {
        a: newTx({
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

      const newTransaction = newTx({
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

      const newTransaction = newTx({
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

      const newTransaction = newTx({
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
        a: newTx({
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

      const newTransaction = newTx({
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
