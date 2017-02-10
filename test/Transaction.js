import { assert } from 'chai';

import LoonyInternalError from '../src/LoonyInternalError';
import Transaction from '../src/Transaction';

describe('Transaction', function () {
  describe('#amountMinor', function () {
    it('throws LoonyInternalError if both inflow and outflow are specified',
      function () {
        const tx = new Transaction({ outflow: 3.5, inflow: 5.5 });
        assert.throws(
          () => { tx.amountMinor(); },
          LoonyInternalError, /Both inflow and outflow specified/);
      });

    it('returns outflow', function () {
      const tx = new Transaction({ outflow: 3.5 });
      assert.equal(tx.amountMinor(), -350);
    });

    it('returns inflow', function () {
      const tx = new Transaction({ inflow: 20.5 });
      assert.equal(tx.amountMinor(), 2050);
    });
  });

  describe('firebaseData', function () {
    it('returns', function () {
      const tx = new Transaction({
        dateMs: 12345,
        memo: 'hello',
        outflow: 300,
      });

      const expected = {
        accountId: 'test-account-id',
        transferSrcAccountId: null,
        transferDstAccountId: null,
        dateMs: 12345,
        payeeId: 'test-payee-id',
        amountMinor: -30000,
        chargedCurrency: null,
        chargedCurrencyAmountMinor: null,
        memo: 'hello',
        cleared: false,
        reconciled: false,
        categories: {
          'test-category-id': {
            amountMinor: -30000,
            chargedCurrencyAmountMinor: null,
            incomeAvailableNextMonth: false,
            debtorId: null,
          },
        },
      };
      assert.deepEqual(tx.firebaseData(), expected);
    });
  });
});
