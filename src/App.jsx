import React from 'react';
import firebase from 'firebase';

import LoonyInternalError from './LoonyInternalError';
import Transaction from './Transaction';
import TransactionTable from './TransactionTable';

const TEST_USER_ID = 'test-user-id';
const TEST_BUDGET_ID = 'test-budget-id';

export default class App extends React.Component {
  // Return a firebase.database.Reference for the given path.
  // Used as a test seam.
  static getRef(path) {
    return firebase.database().ref(path);
  }

  static budgetRef() {
    return App.getRef(`/users/${TEST_USER_ID}/budgets/${TEST_BUDGET_ID}`);
  }

  // Callbacks that can be stubbed out in tests to signal when the component
  // finishes rendering changes to transactions.
  static testOnlyTransactionAddedComplete() {}
  static testOnlyTransactionChangedComplete() {}
  static testOnlyTransactionRemovedComplete() {}

  constructor(props) {
    super(props);
    this.state = {
      transactions: {},
    };

    this.addTransaction = this.addTransaction.bind(this);
    this.editTransaction = this.editTransaction.bind(this);
  }

  componentDidMount() {
    const setTransaction = (data, callback) => {
      this.setState(prevState => ({
        transactions: {
          ...prevState.transactions,
          [data.key]: Transaction.fromFirebaseData(data.key, data.val()),
        },
      }),
      callback);
    };

    App.budgetRef().child('transactions').on('child_added', (data) => {
      setTransaction(data, App.testOnlyTransactionAddedComplete);
    });

    App.budgetRef().child('transactions').on('child_changed', (data) => {
      setTransaction(data, App.testOnlyTransactionChangedComplete);
    });

    App.budgetRef().child('transactions').on('child_removed', (data) => {
      this.setState((prevState) => {
        const transactions = { ...prevState.transactions };
        delete transactions[data.key];
        return { transactions };
      },
      App.testOnlyTransactionRemovedComplete);
    });
  }

  /* eslint-disable class-methods-use-this */
  addTransaction(transaction) {
    // TODO: Disallow transactions with incomplete data.
    const ref = App.budgetRef().child('transactions').push();
    return ref.set(transaction.firebaseData())
      // Return the ref to the caller in the promise.
      .then(() => new Promise(resolve => resolve(ref)))
      .catch((error) => {
        throw new LoonyInternalError(
          `Write failed: ${error}; ref=${ref.toString()}, tx=${transaction}`);
      });
  }
  /* eslint-enable class-methods-use-this */

  /* eslint-disable class-methods-use-this */
  editTransaction(id, transaction) {
    if (id !== transaction.id) {
      throw new LoonyInternalError(
          `id does not match transaction.id: "${id}" vs. "${transaction.id}"`);
    }

    const ref = App.budgetRef().child('transactions').child(id);
    return ref.transaction((currentData) => {
      // Bail if the transaction with the given id no longer exists.
      if (currentData === null) {
        return undefined;
      }
      return transaction.firebaseData();
    });
  }
  /* eslint-enable class-methods-use-this */

  render() {
    return (
      <div>
        <h1>Loony</h1>
        <TransactionTable
          transactions={this.state.transactions}
          newTransactionHandler={this.addTransaction}
          editTransactionHandler={this.editTransaction}
        />
      </div>
    );
  }
}

App.propTypes = {
};
