import moment from 'moment';
import React from 'react';
import uuid from 'uuid';

export default class AddTransactionRow extends React.Component {
  static propTypes = {
    // TODO: Add function signature.
    newTransactionHandler: React.PropTypes.func
  }

  constructor(props) {
    super(props);

    this.state = {
      account: '',
      date: moment().format('YYYY-MM-DD'),
      payee: '',
      category: '',
      memo: '',
      outflow: '',
      inflow: ''
    };
  }

  handleInputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value
    })
  }

  handleAdd = (event) => {
    const transaction = {
      id: uuid.v4(),
      dateMs: moment(this.state.date).valueOf(),
      account: this.state.account,
      payee: this.state.payee,
      category: this.state.category,
      memo: this.state.memo,
      // TODO: Using floats for currencies is so, so wrong.
      outflow: parseFloat(this.state.outflow),
      inflow: parseFloat(this.state.inflow),
    }
    this.props.newTransactionHandler(transaction);
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
            <input type="submit" value="Add" onClick={this.handleAdd} />
          </td>
        </tr>
    );
  }
}
