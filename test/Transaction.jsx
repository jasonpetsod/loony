import { assert } from 'chai';

import LoonyInternalError from '../src/LoonyInternalError';
import Transaction from '../src/Transaction';

describe('Transaction', function () {
  describe('ctor', function () {
    it('both inflow and outflow cannot be specified', function () {
      assert.throws(
        /* eslint-disable no-new */
        () => { new Transaction({ inflow: 1.0, outflow: 200 }); },
        /* eslint-enable no-new */
        LoonyInternalError, /Both outflow.*and inflow/);
    });

    it('both inflow and outflow can be zero', function () {
      const tx = new Transaction({ outflow: 0, inflow: 0 });
      assert.equal(tx.amountMinor, 0);
    });

    it('outflow must be non-negative', function () {
      assert.throws(
        /* eslint-disable no-new */
        () => { new Transaction({ outflow: -100 }); },
        /* eslint-enable no-new */
        LoonyInternalError, /outflow can't be negative/);
    });

    it('inflow must be non-negative', function () {
      assert.throws(
        /* eslint-disable no-new */
        () => { new Transaction({ inflow: -100 }); },
        /* eslint-enable no-new */
        LoonyInternalError, /inflow can't be negative/);
    });

    it('amountMinor parsed from inflow', function () {
      const tx = new Transaction({ inflow: 200 });
      assert.equal(tx.amountMinor, 20000);
    });

    it('amountMinor parsed from outflow', function () {
      const tx = new Transaction({ outflow: 200 });
      assert.equal(tx.amountMinor, -20000);
    });
  });  // ctor

  describe('outflow', function () {
    it('returns if outflow given', function () {
      const tx = new Transaction({ outflow: 200 });
      assert.equal(tx.outflow(), 200);
    });

    it('returns zero with zero outflow', function () {
      const tx = new Transaction({ outflow: 0 });
      assert.equal(tx.outflow(), 0);
    });

    it('returns zero if only inflow given', function () {
      const tx = new Transaction({ inflow: 200 });
      assert.equal(tx.outflow(), 0);
    });
  });  // outflow

  describe('inflow', function () {
    it('returns if inflow given', function () {
      const tx = new Transaction({ inflow: 200 });
      assert.equal(tx.inflow(), 200);
    });

    it('returns zero with zero inflow', function () {
      const tx = new Transaction({ inflow: 0 });
      assert.equal(tx.inflow(), 0);
    });

    it('returns zero if only outflow given', function () {
      const tx = new Transaction({ outflow: 200 });
      assert.equal(tx.inflow(), 0);
    });
  });  // inflow
});
