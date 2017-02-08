import React from 'react';

import AddTransactionRow from './AddTransactionRow';
import Transaction from './Transaction';
import TransactionRow from './TransactionRow';

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
  transactions: React.PropTypes.objectOf(
    React.PropTypes.instanceOf(Transaction)).isRequired,

  // function (tx: Transaction) => undefined.
  newTransactionHandler: React.PropTypes.func.isRequired,

  // function (id: string, tx: Transaction) => undefined.
  editTransactionHandler: React.PropTypes.func.isRequired,
};
