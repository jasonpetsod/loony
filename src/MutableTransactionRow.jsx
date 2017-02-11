import moment from 'moment';
import React from 'react';

import Transaction from './Transaction';

export default class MutableTransactionRow extends React.Component {
  // Test seam.
  static getDate() {
    return moment().format('YYYY-MM-DD');
  }

  static getEmptyState() {
    return {
      id: null,
      account: '',
      date: MutableTransactionRow.getDate(),
      payee: '',
      category: '',
      memo: '',
      outflow: '',
      inflow: '',
    };
  }

  constructor(props) {
    super(props);

    if (this.props.initialTransaction === null) {
      this.state = MutableTransactionRow.getEmptyState();
    } else {
      this.state = {
        id: this.props.initialTransaction.id,
        account: this.props.initialTransaction.account,
        date: this.props.initialTransaction.prettyDate(),
        payee: this.props.initialTransaction.payee,
        category: this.props.initialTransaction.category,
        memo: this.props.initialTransaction.memo,
        outflow: this.props.initialTransaction.outflow(),
        inflow: this.props.initialTransaction.inflow(),
      };
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const { name, value } = target;
    this.setState({ [name]: value });
  }

  handleSubmit() {
    const tx = new Transaction({
      id: this.state.id,
      account: this.state.account,
      dateMs: moment.utc(this.state.date, 'YYYY-MM-DD').valueOf(),
      payee: this.state.payee,
      category: this.state.category,
      memo: this.state.memo,
      // TODO: Stop using floats to represent money.
      outflow: parseFloat(this.state.outflow),
      inflow: parseFloat(this.state.inflow),
    });

    this.props.submitHandler(tx);
    // Clear the state so this component can be reused (e.g. by
    // AddTransactionRow).
    this.setState(MutableTransactionRow.getEmptyState());
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
            value={this.state.account}
            onChange={this.handleInputChange}
          />
        </td>
        <td>
          <input
            type="date"
            name="date"
            placeholder="Date"
            value={this.state.date}
            onChange={this.handleInputChange}
          />
        </td>
        <td>
          <input
            type="text"
            name="payee"
            placeholder="Payee"
            value={this.state.payee}
            onChange={this.handleInputChange}
          />
        </td>
        <td>
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={this.state.category}
            onChange={this.handleInputChange}
          />
        </td>
        <td>
          <input
            type="text"
            name="memo"
            placeholder="Memo"
            value={this.state.memo}
            onChange={this.handleInputChange}
          />
        </td>
        <td>
          <input
            type="text"
            name="outflow"
            placeholder="Outflow"
            value={this.state.outflow}
            onChange={this.handleInputChange}
          />
        </td>
        <td>
          <input
            type="text"
            name="inflow"
            placeholder="Inflow"
            value={this.state.inflow}
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
