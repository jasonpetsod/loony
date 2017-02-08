import React from 'react';

import MutableTransactionRow from './MutableTransactionRow';

export default class AddTransactionRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleAdd = this.handleAdd.bind(this);
  }

  handleAdd(tx) {
    this.props.newTransactionHandler(tx);  // App#addTransaction
  }

  render() {
    return (
      <MutableTransactionRow
        submitHandler={this.handleAdd}
        submitButtonLabel="Add"
      />
    );
  }
}

AddTransactionRow.propTypes = {
  // function (tx: Transaction) => undefined.
  newTransactionHandler: React.PropTypes.func.isRequired,
};
