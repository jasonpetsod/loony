import accounting from 'accounting';
import moment from 'moment';
import React from 'react';

import AddTransactionRow from './addTransactionRow.jsx';
import * as propTypes from './propTypes';

function TransactionRow(props) {
  return (
    <tr>
      <td>{props.transaction.account}</td>
      <td>{moment(props.transaction.dateMs).format('YYYY-MM-DD')}</td>
      <td>{props.transaction.payee}</td>
      <td>{props.transaction.category}</td>
      <td>{props.transaction.memo}</td>
      <td style={{ textAlign: 'right' }}>
        {accounting.formatMoney(props.transaction.outflow, '$')}
      </td>
      <td style={{ textAlign: 'right' }}>
        {accounting.formatMoney(props.transaction.inflow, '$')}
      </td>
    </tr>
  );
}

TransactionRow.propTypes = {
  transaction: propTypes.transaction,
};


export default class TransactionTable extends React.Component {
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
            newTransactionHandler={this.props.newTransactionHandler}
          />
        </tbody>
      </table>
    );
  }
}
