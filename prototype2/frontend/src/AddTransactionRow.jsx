import React from 'react';
import uuid from 'uuid';

import MutableTransactionRow from './MutableTransactionRow';

export default class AddTransactionRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleAdd = this.handleAdd.bind(this);
  }

  handleAdd(data) {
    // TODO: Create a unified Transaction type.
    const transaction = {
      id: uuid.v4(),
      dateMs: data.dateMs,
      account: data.account,
      payee: data.payee,
      category: data.category,
      memo: data.memo,
      outflow: data.outflow,
      inflow: data.inflow,
    };
    this.props.newTransactionHandler(transaction);
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
  // TODO: Add function signature.
  newTransactionHandler: React.PropTypes.func.isRequired,
};
