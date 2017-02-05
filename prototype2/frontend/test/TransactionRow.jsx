import { assert } from 'chai';
import { mount } from 'enzyme';
import React from 'react';

import EditTransactionRow from '../src/EditTransactionRow';
import Transaction from '../src/Transaction';
import TransactionRow from '../src/TransactionRow';

describe('<TransactionRow />', function () {
  const createWrapper = (transaction) => {
    const options = {
      attachTo: global.document.createElement('tbody'),
    };
    return mount(
      <TransactionRow
        transaction={transaction}
        editTransactionHandler={() => {}}
      />,
      options);
  };

  describe('renders', function () {
    it('view mode by default', function () {
      const transaction = new Transaction({
        id: 'a',
        dateMs: 1483228800000,  // 2017-01-01 00:00:00 UTC
        account: 'Cash',
        payee: 'Mu Ramen',
        category: 'Restaurants',
        memo: 'yay noodles',
        outflow: 23,
        inflow: 19.89,
      });
      const wrapper = createWrapper(transaction);

      assert.lengthOf(wrapper.find(EditTransactionRow), 0);

      const cells = wrapper.find('td').map(i => i.getNode().innerHTML);

      const expectedCells = [
        'Cash',
        '2017-01-01',
        'Mu Ramen',
        'Restaurants',
        'yay noodles',
        '$23.00',
        '$19.89',
      ];
      assert.deepEqual(cells, expectedCells);
    });

    it('editor on click', function () {
      const transaction = new Transaction({
        id: 'a',
        dateMs: 1483228800000,  // 2017-01-01 00:00:00 UTC
        account: 'Cash',
        payee: 'Mu Ramen',
        category: 'Restaurants',
        memo: 'yay noodles',
        outflow: 23,
        inflow: 19.89,
      });
      const wrapper = createWrapper(transaction);

      wrapper.find('tr').simulate('click');
      assert.lengthOf(wrapper.find(EditTransactionRow), 1);
    });

    it('editor returns to view on submission', function () {
      const transaction = new Transaction({
        id: 'a',
        dateMs: 1483228800000,  // 2017-01-01 00:00:00 UTC
        account: 'Cash',
        payee: 'Mu Ramen',
        category: 'Restaurants',
        memo: 'yay noodles',
        outflow: 23,
        inflow: 19.89,
      });
      const wrapper = createWrapper(transaction);

      wrapper.find('tr').simulate('click');
      wrapper.find('input[type="submit"]').simulate('click');
      assert.lengthOf(wrapper.find(EditTransactionRow), 0);
      assert.lengthOf(wrapper.find('input'), 0);
    });
  });
});
