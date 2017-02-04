import accounting from 'accounting';
import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid';

import AddTransactionRow from './addTransactionRow.jsx';
import * as propTypes from './propTypes';

class TransactionRow extends React.Component {
  static propTypes = {
    transaction: propTypes.transaction,
  };

  render() {
    return (
        <tr>
          <td>{this.props.transaction.account}</td>
          <td>{moment(this.props.transaction.dateMs).format('YYYY-MM-DD')}</td>
          <td>{this.props.transaction.payee}</td>
          <td>{this.props.transaction.category}</td>
          <td>{this.props.transaction.memo}</td>
          <td style={{textAlign:'right'}}>
            {accounting.formatMoney(this.props.transaction.outflow, '$')}
          </td>
          <td style={{textAlign:'right'}}>
            {accounting.formatMoney(this.props.transaction.inflow, '$')}
          </td>
        </tr>
    );
  }
}

class TransactionTable extends React.Component {
  static propTypes = {
    transactions: React.PropTypes.arrayOf(propTypes.transaction),
    // TODO: Add function signature.
    newTransactionHandler: React.PropTypes.func
  };

  render() {
    const rows = this.props.transactions.map((t) =>
        <TransactionRow key={t.id} transaction={t} />
    );
    return (
        <table>
        <thead>
          <tr>
            <th>Account</th>
            <th>Date</th>
            <th>Payee</th>
            <th>Category</th>
            <th>Memo</th>
            <th>Outflow</th>
            <th>Inflow</th>
          </tr>
        </thead>
        <tbody>
        {rows}
        <AddTransactionRow
          newTransactionHandler={this.props.newTransactionHandler} />
        </tbody>
        </table>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: props.transactions,
    }
  }

  addTransaction = (transaction) => {
    this.setState((prevState, props) => {
      let transactions = prevState.transactions;
      transactions.push(transaction);
      return {transactions: transactions};
    });
  }

  render() {
    return (
        <div>
        <h1>Loony</h1>
        <TransactionTable
          transactions={this.state.transactions}
          newTransactionHandler={this.addTransaction} />
        </div>
    );
  }
}

// TODO: Convert this to an object keyed by transaction ID.
const TRANSACTIONS = [
  {
    id: '1',
    dateMs: 1483246800000,  // 2017-01-01 00:00 UTC-05:00
    account: 'Checking',
    payee: 'Google Inc.',
    category: 'Income for January',
    memo: null,
    outflow: null,
    inflow: 100.00,
  },
  {
    id: '2',
    dateMs: 1483678800000,  // 2017-01-06 00:00 UTC-05:00
    account: 'Cash',
    payee: 'Raku',
    category: 'Restaurants',
    memo: null,
    outflow: 27.31,
    inflow: null,
  },
  {
    id: '3',
    dateMs: 1483938000000,  // 2017-01-09 00:00 UTC-05:00
    account: 'Chase Sapphire Reserve',
    payee: 'Ippudo',
    category: 'Restaurants',
    memo: null,
    outflow: 27.31,
    inflow: null,
  },
];

ReactDOM.render(
  <App transactions={TRANSACTIONS} />,
  document.getElementById('root')
);
