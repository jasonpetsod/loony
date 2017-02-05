import React from 'react';

import MutableTransactionRow from './MutableTransactionRow';
import propTypes from './propTypes';

export default class EditTransactionRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
  }

  /* eslint-disable no-unused-vars */
  handleSave(data) {
    this.props.editCompleteHandler();
  }
  /* eslint-enable no-unused-vars */

  render() {
    return (
      <MutableTransactionRow
        initialTransactionData={this.props.transaction}
        submitHandler={this.handleSave}
      />
    );
  }
}

EditTransactionRow.propTypes = {
  transaction: propTypes.transaction.isRequired,

  // Function to call once the edit has completed.
  editCompleteHandler: React.PropTypes.func.isRequired,
};
