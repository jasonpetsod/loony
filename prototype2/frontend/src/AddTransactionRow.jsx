import React from 'react';
import uuid from 'uuid';

import MutableTransactionRow from './MutableTransactionRow';

export default class AddTransactionRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleAdd = this.handleAdd.bind(this);
  }

  handleAdd(tx) {
    // TODO: Move ID creation to Transaction.
    tx.id = uuid.v4();  // eslint-disable-line no-param-reassign
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
