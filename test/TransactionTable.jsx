import { assert } from 'chai';
import Decimal from 'decimal.js-light';
import { shallow } from 'enzyme';
import React from 'react';

import { newTx } from './transactionTestLib';
import AddTransactionRow from '../src/AddTransactionRow';
import TransactionRow from '../src/TransactionRow';
import TransactionTable from '../src/TransactionTable';

describe('<TransactionTable />', function () {
  const createWrapper = function (transactions) {
    const dummyHandler = function () {};
    const wrapper = shallow(
      <TransactionTable
        transactions={transactions}
        newTransactionHandler={dummyHandler}
        editTransactionHandler={dummyHandler}
      />);
    return wrapper;
  };

  it('should support no transactions', function () {
    const wrapper = createWrapper({});
    assert.lengthOf(wrapper.find(TransactionRow), 0);
    assert.lengthOf(wrapper.find(AddTransactionRow), 1);
  });

  it('should render multiple transactions', function () {
    const transactions = {
      a: newTx({
        id: 'a',
        dateMs: 1483246800000,  // 2017-01-01 00:00 UTC-05:00
        account: 'Checking',
        payee: 'Werk',
        category: 'Income for January',
        amountMinor: new Decimal('10000'),
      }),
      b: newTx({
        id: 'b',
        dateMs: 1483678800000,  // 2017-01-06 00:00 UTC-05:00
        account: 'Cash',
        payee: 'Raku',
        category: 'Restaurants',
        amountMinor: new Decimal('-2731'),
      }),
    };
    const wrapper = createWrapper(transactions);
    assert.lengthOf(wrapper.find(TransactionRow), 2);
    assert.lengthOf(wrapper.find(AddTransactionRow), 1);
  });

  it('should sort transactions in ascending date order');
});
