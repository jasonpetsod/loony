import React from 'react';

import MutableTransactionRow from './MutableTransactionRow';
import PropTypes from './PropTypes';

export default class EditTransactionRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
  }

  handleSave(data) {
    this.props.editTransactionHandler(data.id, data);  // App#editTransaction
    this.props.editCompleteHandler();
  }

  render() {
    return (
      <MutableTransactionRow
        initialTransactionData={this.props.transaction}
        submitHandler={this.handleSave}
        submitButtonLabel="Save"
      />
    );
  }
}

EditTransactionRow.propTypes = {
  transaction: PropTypes.transaction.isRequired,

  // Function to call to save the contents of the new transaction.
  editTransactionHandler: React.PropTypes.func.isRequired,

  // Function to call once the edit has completed.
  editCompleteHandler: React.PropTypes.func.isRequired,
};
