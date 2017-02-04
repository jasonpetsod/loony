import React from 'react';

const transaction = React.PropTypes.shape({
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

export {transaction};
