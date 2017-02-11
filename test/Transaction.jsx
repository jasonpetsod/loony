import Decimal from 'decimal.js-light';
import { assert } from 'chai';

import LoonyInternalError from '../src/LoonyInternalError';
import Transaction from '../src/Transaction';

describe('Transaction', function () {
  describe('ctor', function () {
    it('amountMinor must be Decimal', function () {
      assert.throws(
        /* eslint-disable no-new */
        () => { new Transaction({ amountMinor: 1000 }); },
        /* eslint-enable no-new */
        LoonyInternalError, /amountMinor isn't Decimal/);
    });
  });  // ctor

  describe('outflow', function () {
    it('returns with negative amountMinor', function () {
      const tx = new Transaction({ amountMinor: new Decimal('-20000') });
      assert.equal(tx.outflow(), 200);
    });

    it('returns zero with zero amountMinor', function () {
      const tx = new Transaction({ amountMinor: new Decimal('0') });
      assert.equal(tx.outflow(), 0);
    });

    it('returns zero with positive amountMinor', function () {
      const tx = new Transaction({ amountMinor: new Decimal('20000') });
      assert.equal(tx.outflow(), 0);
    });
  });  // outflow

  describe('inflow', function () {
    it('returns with positive amountMinor', function () {
      const tx = new Transaction({ amountMinor: new Decimal('20000') });
      assert.equal(tx.inflow(), 200);
    });

    it('returns zero with zero amountMinor', function () {
      const tx = new Transaction({ amountMinor: new Decimal('0') });
      assert.equal(tx.inflow(), 0);
    });

    it('returns zero with negative amountMinor', function () {
      const tx = new Transaction({ amountMinor: new Decimal('-20000') });
      assert.equal(tx.inflow(), 0);
    });
  });  // inflow
});
