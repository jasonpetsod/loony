import React from 'react';

import LoonyInternalError from './LoonyInternalError';
import TransactionTable from './TransactionTable';
import PropTypes from './PropTypes';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: props.transactions,
    };

    this.addTransaction = this.addTransaction.bind(this);
    this.editTransaction = this.editTransaction.bind(this);
  }

  addTransaction(transaction) {
    // TODO: Disallow transactions with incomplete data.
    // TODO: Ensure transaction with the ID doesn't already exist.

    this.setState((prevState) => {
      const transactions = prevState.transactions;
      transactions[transaction.id] = transaction;
      return { transactions };
    });
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
  transactions: React.PropTypes.objectOf(PropTypes.transaction).isRequired,
};
