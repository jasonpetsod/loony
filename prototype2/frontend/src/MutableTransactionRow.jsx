import moment from 'moment';
import React from 'react';

import PropTypes from './PropTypes';

export default class MutableTransactionRow extends React.Component {
  constructor(props) {
    super(props);

    let initialState = null;
    if (this.props.initialTransactionData !== null) {
      initialState = {
        id: this.props.initialTransactionData.id,
        account: this.props.initialTransactionData.account,
        date: moment(this.props.initialTransactionData.dateMs)
          .format('YYYY-MM-DD'),
        payee: this.props.initialTransactionData.payee,
        category: this.props.initialTransactionData.category,
        memo: this.props.initialTransactionData.memo,
        outflow: this.props.initialTransactionData.outflow,
        inflow: this.props.initialTransactionData.inflow,
      };
    } else {
      initialState = {
        id: '',
        account: '',
        date: moment().format('YYYY-MM-DD'),
        payee: '',
        category: '',
        memo: '',
        outflow: '',
        inflow: '',
      };
    }
    this.state = initialState;

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit() {
    const data = {
      id: this.state.id,
      dateMs: moment(this.state.date).valueOf(),
      account: this.state.account,
      payee: this.state.payee,
      category: this.state.category,
      memo: this.state.memo,
      // TODO: Using floats for currencies is so, so wrong.
      outflow: parseFloat(this.state.outflow),
      inflow: parseFloat(this.state.inflow),
    };
    return this.props.submitHandler(data);
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
            value={this.props.submitButtonLabel}
            onClick={this.handleSubmit}
          />
        </td>
      </tr>
    );
  }
}

MutableTransactionRow.propTypes = {
  // Function takes an object with fields defined in
  // MutableTransactionRow#handleSubmit.
  submitHandler: React.PropTypes.func.isRequired,

  initialTransactionData: PropTypes.transaction,

  submitButtonLabel: React.PropTypes.string.isRequired,
};

MutableTransactionRow.defaultProps = {
  initialTransactionData: null,
};
