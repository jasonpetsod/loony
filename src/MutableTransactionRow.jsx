import Decimal from 'decimal.js-light';
import moment from 'moment';
import React from 'react';

import Transaction from './Transaction';
import errors from './errors';

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

  static parseAmountMinor(inflowStr, outflowStr) {
    let inflow = new Decimal('0');
    let outflow = new Decimal('0');

    if (inflowStr !== '') {
      try {
        inflow = new Decimal(inflowStr);
      } catch (e) {
        throw new errors.ParseError(`inflow is not a number: ${inflowStr}`);
      }
    }

    if (outflowStr !== '') {
      try {
        outflow = new Decimal(outflowStr);
      } catch (e) {
        throw new errors.ParseError(`outflow is not a number: ${outflowStr}`);
      }
    }

    if (!outflow.isZero() && !inflow.isZero()) {
      throw new errors.ParseError(
        `Both outflow=${outflow} and inflow=${inflow} can't be given`);
    }

    if (outflow < 0) {
      throw new errors.ParseError(`outflow can't be negative: ${outflow}`);
    }
    if (inflow < 0) {
      throw new errors.ParseError(`inflow can't be negative: ${outflow}`);
    }

    if (inflow > 0) {
      // TODO: Support currencies with different minor units.
      return inflow.times(100);
    } else if (outflow > 0) {
      // TODO: Support currencies with different minor units.
      return outflow.neg().times(100);
    }
    return new Decimal('0');
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
      amountMinor: MutableTransactionRow.parseAmountMinor(
        this.state.inflow, this.state.outflow),
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
