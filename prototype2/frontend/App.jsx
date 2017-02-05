import React from 'react';

import TransactionTable from './transactionTable';
import propTypes from './propTypes';

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
    this.setState((prevState) => {
      const transactions = prevState.transactions;
      transactions[transaction.id] = transaction;
      return { transactions };
    });
  }

  editTransaction(id, transaction) {
    this.setState((prevState) => {
      const transactions = prevState.transactions;
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
  transactions: React.PropTypes.objectOf(propTypes.transaction).isRequired,
};
