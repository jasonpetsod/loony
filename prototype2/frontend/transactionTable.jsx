import React from 'react';

import AddTransactionRow from './addTransactionRow';
import TransactionRow from './TransactionRow';
import propTypes from './propTypes';

export default function TransactionTable(props) {
  const rows = props.transactions.map(t => (
    <TransactionRow
      key={t.id}
      transaction={t}
      editTransactionHandler={props.editTransactionHandler}
    />
  ));
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
          newTransactionHandler={props.newTransactionHandler}
        />
      </tbody>
    </table>
  );
}

TransactionTable.propTypes = {
  transactions: React.PropTypes.arrayOf(propTypes.transaction).isRequired,
  // TODO: Add function signature.
  newTransactionHandler: React.PropTypes.func.isRequired,
  editTransactionHandler: React.PropTypes.func.isRequired,
};
