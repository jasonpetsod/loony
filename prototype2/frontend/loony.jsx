import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const TRANSACTIONS = {
  a: {
    id: 'a',
    dateMs: 1483246800000,  // 2017-01-01 00:00 UTC-05:00
    account: 'Checking',
    payee: 'Google Inc.',
    category: 'Income for January',
    memo: '',
    outflow: 0,
    inflow: 100.00,
  },
  b: {
    id: 'b',
    dateMs: 1483678800000,  // 2017-01-06 00:00 UTC-05:00
    account: 'Cash',
    payee: 'Raku',
    category: 'Restaurants',
    memo: '',
    outflow: 27.31,
    inflow: 0,
  },
  c: {
    id: 'c',
    dateMs: 1483938000000,  // 2017-01-09 00:00 UTC-05:00
    account: 'Chase Sapphire Reserve',
    payee: 'Ippudo',
    category: 'Restaurants',
    memo: '',
    outflow: 27.31,
    inflow: 0,
  },
};

ReactDOM.render(
  <App transactions={TRANSACTIONS} />,
  document.getElementById('root'));
