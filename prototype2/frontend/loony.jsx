import React from 'react';
import ReactDOM from 'react-dom';

import TransactionTable from './transactionTable';
import propTypes from './propTypes';

class App extends React.Component {
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

  /* eslint-disable class-methods-use-this */
  editTransaction() {
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
  transactions: React.PropTypes.objectOf(propTypes.transaction).isRequired,
};

const TRANSACTIONS = {
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
  c: {
    id: 'c',
    dateMs: 1483938000000,  // 2017-01-09 00:00 UTC-05:00
    account: 'Chase Sapphire Reserve',
    payee: 'Ippudo',
    category: 'Restaurants',
    memo: '',
    outflow: 27.31,
    inflow: 0,
  },
};

ReactDOM.render(
  <App transactions={TRANSACTIONS} />,
  document.getElementById('root'));
