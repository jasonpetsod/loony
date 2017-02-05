import accounting from 'accounting';
import moment from 'moment';
import React from 'react';

import AddTransactionRow from './addTransactionRow';
import * as propTypes from './propTypes';

class TransactionRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.state = {
      editing: null,
    };
  }

  handleInputChange = (event) => {
    console.log("something changed!")
    // TODO: gotta do more here
  }

  handleClick() {
    console.log(this.props.transaction);
    this.setState( {editing: this.props.transaction.id} );
  }

  handleEdit() {
    let tr_id = this.state.editing;

    console.log("editing " + tr_id);
    this.setState( {editing: null} );
  }

  render() {
    if (this.state.editing === this.props.transaction.id) {
      console.log("handling edit");
      return (
        // TODO: Make a factory for these fields and autogen each field based on
        // a separate entity
        <tr>
          <td>
            <input
              type="text"
              name="account"
              placeholder="Account"
              value={this.props.transaction.account}
              onChange={this.handleInputChange}
            />
          </td>
          <td>
            <input
              type="date"
              name="date"
              placeholder="Date"
              value={moment(this.props.transaction.dateMs).format('YYYY-MM-DD')}
              onChange={this.handleInputChange}
            />
          </td>
          <td>
            <input
              type="text"
              name="payee"
              placeholder="Payee"
              value={this.props.transaction.payee}
              onChange={this.handleInputChange}
            />
          </td>
          <td>
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={this.props.transaction.category}
              onChange={this.handleInputChange}
            />
          </td>
          <td>
            <input
              type="text"
              name="memo"
              placeholder="Memo"
              value={this.props.transaction.memo}
              onChange={this.handleInputChange}
            />
          </td>
          <td>
            <input
              type="text"
              name="outflow"
              placeholder="Outflow"
              value={this.props.transaction.outflow}
              onChange={this.handleInputChange}
            />
          </td>
          <td>
            <input
              type="text"
              name="inflow"
              placeholder="Inflow"
              value={this.props.transaction.inflow}
              onChange={this.handleInputChange}
            />
          </td>
          <td>
            <input type="submit" value="Edit" onClick={this.handleEdit} />
          </td>
        </tr>
      );

    } else {
      return (
        <tr onClick={this.handleClick}>
          <td>{this.props.transaction.account}</td>
          <td>{moment(this.props.transaction.dateMs).format('YYYY-MM-DD')}</td>
          <td>{this.props.transaction.payee}</td>
          <td>{this.props.transaction.category}</td>
          <td>{this.props.transaction.memo}</td>
          <td style={{ textAlign: 'right' }}>
            {accounting.formatMoney(this.props.transaction.outflow, '$')}
          </td>
          <td style={{ textAlign: 'right' }}>
            {accounting.formatMoney(this.props.transaction.inflow, '$')}
          </td>
        </tr>
      );
    }
  }
}

TransactionRow.propTypes = {
  transaction: propTypes.transaction.isRequired,
};


export default function TransactionTable(props) {
  const rows = props.transactions.map(t => (
    <TransactionRow key={t.id} transaction={t} />
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
};
