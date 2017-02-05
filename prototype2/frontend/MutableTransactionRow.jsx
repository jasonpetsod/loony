import moment from 'moment';
import React from 'react';

export default class MutableTransactionRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      account: '',
      date: moment().format('YYYY-MM-DD'),
      payee: '',
      category: '',
      memo: '',
      outflow: '',
      inflow: '',
    };

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
          <input type="submit" value="Add" onClick={this.handleSubmit} />
        </td>
      </tr>
    );
  }
}

MutableTransactionRow.propTypes = {
  // Function takes an object with fields defined in
  // MutableTransactionRow#handleSubmit.
  submitHandler: React.PropTypes.func.isRequired,
};
