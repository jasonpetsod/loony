import { assert } from 'chai';

import Transaction from '../src/Transaction';

describe('Transaction', function () {
  describe('outflow', function () {
    it('returns with negative amountMinor', function () {
      const tx = new Transaction({ amountMinor: -20000 });
      assert.equal(tx.outflow(), 200);
    });

    it('returns zero with zero amountMinor', function () {
      const tx = new Transaction({ amountMinor: 0 });
      assert.equal(tx.outflow(), 0);
    });

    it('returns zero with positive amountMinor', function () {
      const tx = new Transaction({ amountMinor: 20000 });
      assert.equal(tx.outflow(), 0);
    });
  });  // outflow

  describe('inflow', function () {
    it('returns with positive amountMinor', function () {
      const tx = new Transaction({ amountMinor: 20000 });
      assert.equal(tx.inflow(), 200);
    });

    it('returns zero with zero amountMinor', function () {
      const tx = new Transaction({ amountMinor: 0 });
      assert.equal(tx.inflow(), 0);
    });

    it('returns zero with negative amountMinor', function () {
      const tx = new Transaction({ amountMinor: -20000 });
      assert.equal(tx.inflow(), 0);
    });
  });  // inflow
});
