import { assert } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import AddTransactionRow from '../addTransactionRow';
import TransactionTable, { TransactionRow } from '../transactionTable';

describe('<TransactionTable />', function () {
  const createWrapper = function (transactions) {
    const dummyNewTransactionHandler = function () {};
    const wrapper = shallow(
      <TransactionTable
        transactions={transactions}
        newTransactionHandler={dummyNewTransactionHandler}
      />);
    return wrapper;
  };

  it('should support no transactions', function () {
    const wrapper = createWrapper([]);
    assert.equal(wrapper.find(TransactionRow).length, 0);
    assert.equal(wrapper.find(AddTransactionRow).length, 1);
  });

  it('should render multple transactions', function () {
    const transactions = [
      {
        id: '1',
        dateMs: 1483246800000,  // 2017-01-01 00:00 UTC-05:00
        account: 'Checking',
        payee: 'Werk',
        category: 'Income for January',
        memo: null,
        outflow: null,
        inflow: 100.00,
      },
      {
        id: '2',
        dateMs: 1483678800000,  // 2017-01-06 00:00 UTC-05:00
        account: 'Cash',
        payee: 'Raku',
        category: 'Restaurants',
        memo: null,
        outflow: 27.31,
        inflow: null,
      },
    ];
    const wrapper = createWrapper(transactions);
    assert.equal(wrapper.find(TransactionRow).length, 2);
    assert.equal(wrapper.find(AddTransactionRow).length, 1);
  });
});
