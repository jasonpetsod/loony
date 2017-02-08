import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import Transaction from './Transaction';

const TRANSACTIONS = {
  a: new Transaction({
    id: 'a',
    dateMs: 1483246800000,  // 2017-01-01 00:00 UTC-05:00
    account: 'Checking',
    payee: 'Google Inc.',
    category: 'Income for January',
    inflow: 100.00,
  }),
  b: new Transaction({
    id: 'b',
    dateMs: 1483678800000,  // 2017-01-06 00:00 UTC-05:00
    account: 'Cash',
    payee: 'Raku',
    category: 'Restaurants',
    outflow: 27.31,
  }),
  c: new Transaction({
    id: 'c',
    dateMs: 1483938000000,  // 2017-01-09 00:00 UTC-05:00
    account: 'Chase Sapphire Reserve',
    payee: 'Ippudo',
    category: 'Restaurants',
    outflow: 27.31,
  }),
};

ReactDOM.render(
  <App transactions={TRANSACTIONS} />,
  document.getElementById('root'));
