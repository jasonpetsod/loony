import { assert } from 'chai';
import Decimal from 'decimal.js-light';

import { newTx } from './transactionTestLib';

describe('transactionTestLib', function () {
  describe('newTx', function () {
    it('merges fields correctly', function () {
      const fields = {
        category: 'noodles',
        memo: 'hello',
      };
      const tx = newTx(fields);
      const expected = {
        id: 'test-id',
        account: 'test-account',
        dateMs: 1483228800000,  // 2017-01-01 00:00 UTC
        payee: 'test-payee',
        category: 'noodles',
        memo: 'hello',
        amountMinor: new Decimal('1999'),
      };
      assert.deepEqual(tx, expected);
    });
  });  // newTx
});  // transactionTestLib
