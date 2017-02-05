import React from 'react';

import Transaction from './Transaction';

// TODO: Change call sites to reference React.PropTypes.instanceOf directly.
const transaction = React.PropTypes.instanceOf(Transaction);

export default {
  transaction,
};
