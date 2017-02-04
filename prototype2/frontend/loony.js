import accounting from 'accounting';
import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid';

const transactionPropType = React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    // Milliseconds since the epoch.
    dateMs: React.PropTypes.number.isRequired,
    account: React.PropTypes.string.isRequired,
    payee: React.PropTypes.string.isRequired,
    category: React.PropTypes.string,
    memo: React.PropTypes.string,
    outflow: React.PropTypes.number,
    inflow: React.PropTypes.number,
});

class TransactionRow extends React.Component {
  static propTypes = {
    transaction: transactionPropType,
  };

  render() {
    return (
        <tr>
          <td>{this.props.transaction.account}</td>
          <td>{moment(this.props.transaction.dateMs).format('YYYY-MM-DD')}</td>
          <td>{this.props.transaction.payee}</td>
          <td>{this.props.transaction.category}</td>
          <td>{this.props.transaction.memo}</td>
          <td style={{textAlign:'right'}}>
            {accounting.formatMoney(this.props.transaction.outflow, '$')}
          </td>
          <td style={{textAlign:'right'}}>
            {accounting.formatMoney(this.props.transaction.inflow, '$')}
          </td>
        </tr>
    );
  }
}

class AddTransactionRow extends React.Component {
  static propTypes = {
    // TODO: Add function signature.
    newTransactionHander: React.PropTypes.func
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

class TransactionTable extends React.Component {
  static propTypes = {
    transactions: React.PropTypes.arrayOf(transactionPropType),
    // TODO: Add function signature.
    newTransactionHandler: React.PropTypes.func
  };

  render() {
    const rows = this.props.transactions.map((t) =>
        <TransactionRow key={t.id} transaction={t} />
    );
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
          newTransactionHandler={this.props.newTransactionHandler} />
        </tbody>
        </table>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: props.transactions,
    }
  }

  addTransaction = (transaction) => {
    this.setState((prevState, props) => {
      let transactions = prevState.transactions;
      transactions.push(transaction);
      return {transactions: transactions};
    });
  }

  render() {
    return (
        <div>
        <h1>Loony</h1>
        <TransactionTable
          transactions={this.state.transactions}
          newTransactionHandler={this.addTransaction} />
        </div>
    );
  }
}

// TODO: Convert this to an object keyed by transaction ID.
const TRANSACTIONS = [
  {
    id: '1',
    dateMs: 1483246800000,  // 2017-01-01 00:00 UTC-05:00
    account: 'Checking',
    payee: 'Google Inc.',
    category: 'Income for January',
    memo: null,
    outflow: null,
    inflow: 100.00,
  },
  {
    id: '2',
    dateMs: 1483678800000,  // 2017-01-06 00:00 UTC-05:00
    account: 'Cash',
    payee: 'Raku',
    category: 'Restaurants',
    memo: null,
    outflow: 27.31,
    inflow: null,
  },
  {
    id: '3',
    dateMs: 1483938000000,  // 2017-01-09 00:00 UTC-05:00
    account: 'Chase Sapphire Reserve',
    payee: 'Ippudo',
    category: 'Restaurants',
    memo: null,
    outflow: 27.31,
    inflow: null,
  },
];

ReactDOM.render(
  <App transactions={TRANSACTIONS} />,
  document.getElementById('root')
);
