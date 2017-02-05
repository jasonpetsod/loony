import React from 'react';

import MutableTransactionRow from './MutableTransactionRow';
import propTypes from './propTypes';

export default class EditTransactionRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
  }

  /* eslint-disable class-methods-use-this, no-unused-vars */
  handleSave(data) {
  }
  /* eslint-enable class-methods-use-this, no-unused-vars */

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
};
