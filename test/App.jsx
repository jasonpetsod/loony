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
  let testPrefix = null;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    testPrefix = `test/App/${uuid.v4()}`;
  });

  afterEach(function () {
    sandbox.restore();
    firebase.database().ref(testPrefix).remove();
  });

  const stubGetRef = (prefix) => {
    assert.isNotNull(prefix);
    const getRef = path => firebase.database().ref(`${prefix}/${path}`);
    sandbox.stub(App, 'getRef', getRef);
  };

  // Wait for a condition to be true, polling every 250 ms. No deadline; Mocha
  // will timeout the test after 2000 ms by default. (Each test's timeout is
  // configurable using this.timeout in a test context.)
  const waitFor = condition => new Promise((resolve) => {
    const check = () => {
      if (condition()) {
        resolve();
      }
      window.setTimeout(check, 250);
    };
    check();
  });

  describe('transactions/ listeners', function () {
    it('Firebase tx add should add it to state', function () {
      stubGetRef(testPrefix);

      const tx1 = newTx({
        dateMs: 12345,
        amountMinor: new Decimal('100000'),
        memo: 'hello',
      });
      const txRef1 = App.budgetRef().child('transactions').push();

      const tx2 = newTx({
        dateMs: 45678,
        amountMinor: new Decimal('-2030'),
        memo: 'i am hungry',
      });
      const txRef2 = App.budgetRef().child('transactions').push();

      const expectedState = {
        transactions: {
          [txRef1.key]: {
            id: txRef1.key,
            account: '',
            dateMs: 12345,
            payee: '',
            category: '',
            memo: 'hello',
            amountMinor: new Decimal('100000'),
          },
          [txRef2.key]: {
            id: txRef2.key,
            account: '',
            dateMs: 45678,
            payee: '',
            category: '',
            memo: 'i am hungry',
            amountMinor: new Decimal('-2030'),
          },
        },
      };

      const spy = sandbox.stub(App, 'testOnlyTransactionAddedComplete');

      const wrapper = shallow(<App />);
      const app = wrapper.instance();
      app.componentDidMount();

      const p =
        Promise.all([
          txRef1.set(tx1.firebaseData()), txRef2.set(tx2.firebaseData())])
        .then(() => waitFor(() => spy.calledTwice))
        .then(() => {
          assert.deepEqual(wrapper.state(), expectedState);
        })
        .catch((error) => {
          assert(false, `Promise rejected: ${error}`);
        });

      return assert.isFulfilled(p);
    });

    it('Firebase tx add should add a TransactionRow', function () {
      stubGetRef(testPrefix);

      const tx1 = newTx({
        dateMs: 12345,
        amountMinor: new Decimal('100000'),
        memo: 'hello',
      });
      const txRef1 = App.budgetRef().child('transactions').push();
      tx1.id = txRef1.key;

      const tx2 = newTx({
        dateMs: 45678,
        amountMinor: new Decimal('-2030'),
        memo: 'i am hungry',
      });
      const txRef2 = App.budgetRef().child('transactions').push();
      tx1.id = txRef1.key;

      const expected = [
        {
          id: txRef1.key,
          account: '',
          dateMs: 12345,
          payee: '',
          category: '',
          memo: 'hello',
          amountMinor: new Decimal('100000'),
        },
        {
          id: txRef2.key,
          account: '',
          dateMs: 45678,
          payee: '',
          category: '',
          memo: 'i am hungry',
          amountMinor: new Decimal('-2030'),
        },
      ];

      const spy = sandbox.stub(App, 'testOnlyTransactionAddedComplete');

      const wrapper = mount(<App />);

      const p =
        Promise.all([
          txRef1.set(tx1.firebaseData()), txRef2.set(tx2.firebaseData())])
        .then(() => waitFor(() => spy.calledTwice))
        .then(() => {
          const transactions =
            wrapper.find(TransactionRow).map(n => n.prop('transaction'));
          assert.sameDeepMembers(transactions, expected);
        })
        .catch((error) => {
          assert(false, `Promise rejected: ${error}`);
        });

      return assert.isFulfilled(p);
    });

    it('Firebase tx remove should remove it from state', function () {
      stubGetRef(testPrefix);

      const tx1 = newTx({
        dateMs: 12345,
        amountMinor: new Decimal('100000'),
        memo: 'hello',
      });
      const txRef1 = App.budgetRef().child('transactions').push();

      const tx2 = newTx({
        dateMs: 45678,
        amountMinor: new Decimal('-2030'),
        memo: 'i am hungry',
      });
      const txRef2 = App.budgetRef().child('transactions').push();

      const expectedState = {
        transactions: {
          [txRef1.key]: {
            id: txRef1.key,
            account: '',
            dateMs: 12345,
            payee: '',
            category: '',
            memo: 'hello',
            amountMinor: new Decimal('100000'),
          },
        },
      };

      const txAdded = sandbox.stub(App, 'testOnlyTransactionAddedComplete');
      const txRemoved = sandbox.stub(App, 'testOnlyTransactionRemovedComplete');

      const wrapper = shallow(<App />);
      const app = wrapper.instance();
      app.componentDidMount();

      const p =
        Promise.all([
          txRef1.set(tx1.firebaseData()), txRef2.set(tx2.firebaseData())])
        .then(() => waitFor(() => txAdded.calledTwice))
        .then(() => txRef2.remove())
        .then(() => waitFor(() => txRemoved.called))
        .then(() => {
          assert.deepEqual(wrapper.state(), expectedState);
        })
        .catch((error) => {
          assert(false, `Promise rejected: ${error}`);
        });

      return assert.isFulfilled(p);
    });

    it('Firebase tx remove should remove a TransactionRow', function () {
      stubGetRef(testPrefix);

      const tx1 = newTx({
        dateMs: 12345,
        amountMinor: new Decimal('100000'),
        memo: 'hello',
      });
      const txRef1 = App.budgetRef().child('transactions').push();
      tx1.id = txRef1.key;

      const tx2 = newTx({
        dateMs: 45678,
        amountMinor: new Decimal('-2030'),
        memo: 'i am hungry',
      });
      const txRef2 = App.budgetRef().child('transactions').push();
      tx1.id = txRef1.key;

      const expected = [
        {
          id: txRef1.key,
          account: '',
          dateMs: 12345,
          payee: '',
          category: '',
          memo: 'hello',
          amountMinor: new Decimal('100000'),
        },
      ];

      const txAdded = sandbox.stub(App, 'testOnlyTransactionAddedComplete');
      const txRemoved = sandbox.stub(App, 'testOnlyTransactionRemovedComplete');

      const wrapper = mount(<App />);

      const p =
        Promise.all([
          txRef1.set(tx1.firebaseData()), txRef2.set(tx2.firebaseData())])
        .then(() => waitFor(() => txAdded.calledTwice))
        .then(() => txRef2.remove())
        .then(() => waitFor(() => txRemoved.called))
        .then(() => {
          const transactions =
            wrapper.find(TransactionRow).map(n => n.prop('transaction'));
          assert.sameDeepMembers(transactions, expected);
        })
        .catch((error) => {
          assert(false, `Promise rejected: ${error}`);
        });

      return assert.isFulfilled(p);
    });

    it('Firebase tx change should change the tx in state', function () {
      stubGetRef(testPrefix);

      const tx1 = newTx({
        dateMs: 12345,
        amountMinor: new Decimal('100000'),
        memo: 'hello',
      });
      const txRef1 = App.budgetRef().child('transactions').push();

      const tx2 = newTx({
        dateMs: 45678,
        amountMinor: new Decimal('-2030'),
        memo: 'i am hungry',
      });
      const txRef2 = App.budgetRef().child('transactions').push();

      const expectedState = {
        transactions: {
          [txRef1.key]: {
            id: txRef1.key,
            account: '',
            dateMs: 12345,
            payee: '',
            category: '',
            memo: 'goodbye',
            amountMinor: new Decimal('-1500'),
          },
          [txRef2.key]: {
            id: txRef2.key,
            account: '',
            dateMs: 45678,
            payee: '',
            category: '',
            memo: 'i am hungry',
            amountMinor: new Decimal('-2030'),
          },
        },
      };

      const txAdded = sandbox.stub(App, 'testOnlyTransactionAddedComplete');
      const txChanged = sandbox.stub(App, 'testOnlyTransactionChangedComplete');

      const wrapper = shallow(<App />);
      const app = wrapper.instance();
      app.componentDidMount();

      const p =
        Promise.all([
          txRef1.set(tx1.firebaseData()), txRef2.set(tx2.firebaseData())])
        .then(() => waitFor(() => txAdded.calledTwice))
        .then(() => {
          const updates = {
            memo: 'goodbye',
            amountMinor: -1500,
          };
          return txRef1.update(updates);
        })
        .then(() => waitFor(() => txChanged.called))
        .then(() => {
          assert.deepEqual(wrapper.state(), expectedState);
        })
        .catch((error) => {
          assert(false, `Promise rejected: ${error}`);
        });

      return assert.isFulfilled(p);
    });

    it('Firebase tx change should change the TransactionRow', function () {
      stubGetRef(testPrefix);

      const tx1 = newTx({
        dateMs: 12345,
        amountMinor: new Decimal('100000'),
        memo: 'hello',
      });
      const txRef1 = App.budgetRef().child('transactions').push();
      tx1.id = txRef1.key;

      const tx2 = newTx({
        dateMs: 45678,
        amountMinor: new Decimal('-2030'),
        memo: 'i am hungry',
      });
      const txRef2 = App.budgetRef().child('transactions').push();
      tx1.id = txRef1.key;

      const expected = [
        {
          id: txRef1.key,
          account: '',
          dateMs: 12345,
          payee: '',
          category: '',
          memo: 'goodbye',
          amountMinor: new Decimal('-1500'),
        },
        {
          id: txRef2.key,
          account: '',
          dateMs: 45678,
          payee: '',
          category: '',
          memo: 'i am hungry',
          amountMinor: new Decimal('-2030'),
        },
      ];

      const txAdded = sandbox.stub(App, 'testOnlyTransactionAddedComplete');
      const txChanged = sandbox.stub(App, 'testOnlyTransactionChangedComplete');

      const wrapper = mount(<App />);

      const p =
        Promise.all([
          txRef1.set(tx1.firebaseData()), txRef2.set(tx2.firebaseData())])
        .then(() => waitFor(() => txAdded.calledTwice))
        .then(() => {
          const updates = {
            memo: 'goodbye',
            amountMinor: -1500,
          };
          return txRef1.update(updates);
        })
        .then(() => waitFor(() => txChanged.called))
        .then(() => {
          const transactions =
            wrapper.find(TransactionRow).map(n => n.prop('transaction'));
          assert.sameDeepMembers(transactions, expected);
        })
        .catch((error) => {
          assert(false, `Promise rejected: ${error}`);
        });

      return assert.isFulfilled(p);
    });
  });  // transactions/ listeners

  describe('#addTransaction', function () {
    it('should add a new transaction to state', function () {
      stubGetRef(testPrefix);

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
          return waitFor(() => spy.called);
        })
        .then(() => {
          assert.deepEqual(wrapper.state(), expectedState);
        })
        .catch((error) => {
          assert(false, `addTransaction failed: ${error}`);
        });

      return assert.isFulfilled(p);
    });
  });  // #addTransaction

  describe('#editTransaction', function () {
    it('should edit the transaction in state', function () {
      stubGetRef(testPrefix);

      const tx1 = newTx({
        dateMs: 12345,
        amountMinor: new Decimal('100000'),
        memo: 'hello',
      });
      const txRef1 = App.budgetRef().child('transactions').push();
      tx1.id = txRef1.key;

      const tx2 = newTx({
        dateMs: 45678,
        amountMinor: new Decimal('-2030'),
        memo: 'i am hungry',
      });
      const txRef2 = App.budgetRef().child('transactions').push();
      tx2.id = txRef2.key;

      const expectedState = {
        transactions: {
          [txRef1.key]: {
            id: txRef1.key,
            account: '',
            dateMs: 12345,
            payee: '',
            category: '',
            memo: 'goodbye',
            amountMinor: new Decimal('-1500'),
          },
          [txRef2.key]: {
            id: txRef2.key,
            account: '',
            dateMs: 45678,
            payee: '',
            category: '',
            memo: 'i am hungry',
            amountMinor: new Decimal('-2030'),
          },
        },
      };

      const txAdded = sandbox.stub(App, 'testOnlyTransactionAddedComplete');
      const txChanged = sandbox.stub(App, 'testOnlyTransactionChangedComplete');

      const wrapper = shallow(<App />);
      const app = wrapper.instance();
      app.componentDidMount();

      const p =
        Promise.all([
          txRef1.set(tx1.firebaseData()), txRef2.set(tx2.firebaseData())])
        .then(() => waitFor(() => txAdded.calledTwice))
        .then(() => {
          tx1.memo = 'goodbye';
          tx1.amountMinor = new Decimal('-1500');
          return app.editTransaction(txRef1.key, tx1);
        })
        .then(() => waitFor(() => txChanged.called))
        .then(() => {
          assert.deepEqual(wrapper.state(), expectedState);
        });
      return assert.isFulfilled(p);
    });

    it('should fail when the transaction does not exist', function () {
      stubGetRef(testPrefix);

      const tx1 = newTx({
        dateMs: 12345,
        amountMinor: new Decimal('100000'),
        memo: 'hello',
      });
      const txRef1 = App.budgetRef().child('transactions').push();
      tx1.id = txRef1.key;

      const tx2 = newTx({
        dateMs: 45678,
        amountMinor: new Decimal('-2030'),
        memo: 'i am hungry',
      });
      const txRef2 = App.budgetRef().child('transactions').push();
      tx2.id = txRef2.key;

      const expectedState = {
        transactions: {
          [txRef1.key]: {
            id: txRef1.key,
            account: '',
            dateMs: 12345,
            payee: '',
            category: '',
            memo: 'hello',
            amountMinor: new Decimal('100000'),
          },
        },
      };

      const txAdded = sandbox.stub(App, 'testOnlyTransactionAddedComplete');

      const wrapper = shallow(<App />);
      const app = wrapper.instance();
      app.componentDidMount();

      this.timeout(5000);

      const p =
        txRef1.set(tx1.firebaseData())
        .then(() => waitFor(() => txAdded.called))
        .then(() => app.editTransaction(tx2.id, tx2))
        .then((result) => {
          assert.isFalse(result.committed);
          assert.deepEqual(wrapper.state(), expectedState);

          // Ensure Firebase doesn't have anything at txRef2.
          return txRef2.once('value');
        })
        .then((data) => {
          assert.isNull(data.val());
        });
      return assert.isFulfilled(p);
    });

    it('ensures id parameter matches id in transaction', function () {
      const wrapper = shallow(<App />);
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
      stubGetRef(testPrefix);

      const tx1 = newTx({
        dateMs: 12345,
        amountMinor: new Decimal('100000'),
        memo: 'hello',
      });
      const txRef1 = App.budgetRef().child('transactions').push();
      tx1.id = txRef1.key;

      const tx2 = newTx({
        dateMs: 45678,
        amountMinor: new Decimal('-2030'),
        memo: 'i am hungry',
      });
      const txRef2 = App.budgetRef().child('transactions').push();
      tx2.id = txRef2.key;

      const expected = [
        {
          id: txRef1.key,
          account: '',
          dateMs: 12345,
          payee: '',
          category: '',
          memo: 'goodbye',
          amountMinor: new Decimal('-1500'),
        },
        {
          id: txRef2.key,
          account: '',
          dateMs: 45678,
          payee: '',
          category: '',
          memo: 'i am hungry',
          amountMinor: new Decimal('-2030'),
        },
      ];

      const txAdded = sandbox.stub(App, 'testOnlyTransactionAddedComplete');
      const txChanged = sandbox.stub(App, 'testOnlyTransactionChangedComplete');

      const wrapper = mount(<App />);
      const app = wrapper.instance();

      const p =
        Promise.all([
          txRef1.set(tx1.firebaseData()), txRef2.set(tx2.firebaseData())])
        .then(() => waitFor(() => txAdded.calledTwice))
        .then(() => {
          tx1.memo = 'goodbye';
          tx1.amountMinor = new Decimal('-1500');
          return app.editTransaction(txRef1.key, tx1);
        })
        .then(() => waitFor(() => txChanged.called))
        .then(() => {
          const transactions =
            wrapper.find(TransactionRow).map(n => n.prop('transaction'));
          assert.sameDeepMembers(transactions, expected);
        })
        .catch((error) => {
          assert(false, `Promise rejected: ${error}`);
        });

      return assert.isFulfilled(p);
    });
  });
});
