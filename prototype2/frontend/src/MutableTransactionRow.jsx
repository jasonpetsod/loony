import moment from 'moment';
import React from 'react';
import uuid from 'uuid';

import Transaction from './Transaction';

export default class MutableTransactionRow extends React.Component {
  // Test seam.
  static getDate() {
    return moment().format('YYYY-MM-DD');
  }

  // Test seam.
  static getUUID() {
    return uuid.v4();
  }

  static getEmptyTransaction() {
    return new Transaction({
      id: MutableTransactionRow.getUUID(),
      dateMs: MutableTransactionRow.getDate(),
    });
  }

  constructor(props) {
    super(props);

    this.state = {};

    if (this.props.initialTransaction === null) {
      this.state.transaction = MutableTransactionRow.getEmptyTransaction();
    } else {
      this.state.transaction = this.props.initialTransaction;
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const { name, value } = target;
    this.setState((prevState) => {
      const tx = prevState.transaction;
      tx[name] = value;
      return { tx };
    });
  }

  handleSubmit() {
    const tx = this.state.transaction;

    // Parse fields into our actual desired types.
    tx.dateMs = moment.utc(tx.dateMs, 'YYYY-MM-DD').valueOf();
    // TODO: Stop using floats to represent money.
    tx.outflow = parseFloat(tx.outflow);
    tx.inflow = parseFloat(tx.inflow);

    this.props.submitHandler(tx);
    // Clear the state so this component can be reused (e.g. by
    // AddTransactionRow).
    this.state.transaction = MutableTransactionRow.getEmptyTransaction();
  }

  render() {
    // TODO: Make a factory for these fields and autogen each field based on a
    // separate entity.
    return (
      <tr>
        <td>
          <input
            type="text"
            name="account"
            placeholder="Account"
            value={this.state.transaction.account}
            onChange={this.handleInputChange}
          />
        </td>
        <td>
          <input
            type="date"
            name="dateMs"
            placeholder="Date"
            value={
              moment(this.state.transaction.dateMs).utc().format('YYYY-MM-DD')}
            onChange={this.handleInputChange}
          />
        </td>
        <td>
          <input
            type="text"
            name="payee"
            placeholder="Payee"
            value={this.state.transaction.payee}
            onChange={this.handleInputChange}
          />
        </td>
        <td>
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={this.state.transaction.category}
            onChange={this.handleInputChange}
          />
        </td>
        <td>
          <input
            type="text"
            name="memo"
            placeholder="Memo"
            value={this.state.transaction.memo}
            onChange={this.handleInputChange}
          />
        </td>
        <td>
          <input
            type="text"
            name="outflow"
            placeholder="Outflow"
            value={this.state.transaction.outflow}
            onChange={this.handleInputChange}
          />
        </td>
        <td>
          <input
            type="text"
            name="inflow"
            placeholder="Inflow"
            value={this.state.transaction.inflow}
            onChange={this.handleInputChange}
          />
        </td>
        <td>
          <input
            type="submit"
            name="submit"
            value={this.props.submitButtonLabel}
            onClick={this.handleSubmit}
          />
        </td>
      </tr>
    );
  }
}

MutableTransactionRow.propTypes = {
  // function (tx: Transaction) => undefined.
  submitHandler: React.PropTypes.func.isRequired,

  initialTransaction: React.PropTypes.instanceOf(Transaction),

  submitButtonLabel: React.PropTypes.string.isRequired,
};

MutableTransactionRow.defaultProps = {
  initialTransaction: null,
};
