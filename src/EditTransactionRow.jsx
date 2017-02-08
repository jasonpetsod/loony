import React from 'react';

import MutableTransactionRow from './MutableTransactionRow';
import Transaction from './Transaction';

export default class EditTransactionRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
  }

  handleSave(tx) {
    this.props.editTransactionHandler(tx.id, tx);  // App#editTransaction
    this.props.editCompleteHandler();
  }

  render() {
    return (
      <MutableTransactionRow
        initialTransaction={this.props.transaction}
        submitHandler={this.handleSave}
        submitButtonLabel="Save"
      />
    );
  }
}

EditTransactionRow.propTypes = {
  transaction: React.PropTypes.instanceOf(Transaction).isRequired,

  // function (id: string, tx: Transaction) => undefined.
  editTransactionHandler: React.PropTypes.func.isRequired,

  // function () => undefined.
  editCompleteHandler: React.PropTypes.func.isRequired,
};
