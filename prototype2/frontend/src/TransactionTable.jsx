import React from 'react';

import AddTransactionRow from './AddTransactionRow';
import TransactionRow from './TransactionRow';
import PropTypes from './PropTypes';

export default function TransactionTable(props) {
  const transactions = Object.values(props.transactions);
  // Sort transactions in ascending order by date.
  transactions.sort((a, b) => a.dateMs - b.dateMs);
  const rows = transactions.map(t => (
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
  transactions: React.PropTypes.objectOf(PropTypes.transaction).isRequired,
  // TODO: Add function signature.
  newTransactionHandler: React.PropTypes.func.isRequired,
  editTransactionHandler: React.PropTypes.func.isRequired,
};
