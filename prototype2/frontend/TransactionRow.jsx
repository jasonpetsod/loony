import accounting from 'accounting';
import moment from 'moment';
import React from 'react';

import EditTransactionRow from './EditTransactionRow';
import propTypes from './propTypes';

export default class TransactionRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.state = {
      editing: null,
    };
  }

  handleClick() {
    console.log(this.props.transaction);
    this.setState({ editing: this.props.transaction.id });
  }

  handleEdit() {
    const trID = this.state.editing;

    console.log('editing ', trID);
    this.setState({ editing: null });
  }

  render() {
    if (this.state.editing === this.props.transaction.id) {
      console.log('handling edit');
      return (
        <EditTransactionRow
          transaction={this.props.transaction}
        />
      );
    }

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

TransactionRow.propTypes = {
  transaction: propTypes.transaction.isRequired,
};
