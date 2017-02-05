import accounting from 'accounting';
import moment from 'moment';
import React from 'react';

import EditTransactionRow from './EditTransactionRow';
import PropTypes from './PropTypes';

export default class TransactionRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.finishEdit = this.finishEdit.bind(this);
    this.state = {
      editing: null,
    };
  }

  handleClick() {
    this.setState({ editing: this.props.transaction.id });
  }

  finishEdit() {
    this.setState({ editing: null });
  }

  render() {
    if (this.state.editing === this.props.transaction.id) {
      return (
        <EditTransactionRow
          transaction={this.props.transaction}
          editTransactionHandler={this.props.editTransactionHandler}
          editCompleteHandler={this.finishEdit}
        />
      );
    }

    /* eslint-disable jsx-a11y/no-static-element-interactions */
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
    /* eslint-enable jsx-a11y/no-static-element-interactions */
  }
}

TransactionRow.propTypes = {
  transaction: PropTypes.transaction.isRequired,

  editTransactionHandler: React.PropTypes.func.isRequired,
};
