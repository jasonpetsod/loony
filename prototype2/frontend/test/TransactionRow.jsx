import { assert } from 'chai';
import { mount } from 'enzyme';
import 'jsdom-global/register';  // global.document
import React from 'react';

import TransactionRow from '../src/TransactionRow';

describe('<TransactionRow />', function () {
  describe('renders', function () {
    it('view mode by default', function () {
      // TODO: Create a unified Transaction type.
      const transaction = {
        id: '',
        dateMs: 1483228800000,  // 2017-01-01 00:00:00 UTC
        account: 'Cash',
        payee: 'Mu Ramen',
        category: 'Restaurants',
        memo: 'yay noodles',
        outflow: 23,
        inflow: 19.89,
      };

      const options = {
        attachTo: global.document.createElement('tbody'),
      };
      const wrapper = mount(
        <TransactionRow
          transaction={transaction}
          editTransactionHandler={() => {}}
        />,
        options);

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

    it('editor on click');
  });
});
