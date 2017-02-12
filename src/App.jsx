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

  addTransaction(transaction) {
    // TODO: Disallow transactions with incomplete data.

    const ref = App.budgetRef().child('transactions');
    const key = ref.push().key;
    const updates = {
      [key]: transaction.firebaseData(),
    };

    const success = () => {
      transaction.id = key;  // eslint-disable-line no-param-reassign
      // TODO: Remove once listeners on .../transactions are set up.
      this.setState(prevState => ({
        transactions: {
          ...prevState.transactions,
          [key]: transaction,
        },
      }));
    };

    const failed = (error) => {
      throw new LoonyInternalError(
        `Write failed: ${error}; key=${key}, transaction=${transaction}`);
    };

    return ref.update(updates)
      .then(success)
      .catch(failed);
  }

  editTransaction(id, transaction) {
    // TODO: Disallow transactions with incomplete data.

    if (id !== transaction.id) {
      throw new LoonyInternalError(
          `id does not match transaction.id: "${id}" vs. "${transaction.id}"`);
    }

    this.setState((prevState) => {
      const transactions = prevState.transactions;
      if (!Object.prototype.hasOwnProperty.call(transactions, id)) {
        throw new LoonyInternalError(`no transaction with ID: ${id}`);
      }
      transactions[id] = transaction;
      return { transactions };
    });
  }

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
