import { assert } from 'chai';
import Decimal from 'decimal.js-light';

import LoonyInternalError from '../src/LoonyInternalError';
import Transaction from '../src/Transaction';

describe('Transaction', function () {
  describe('ctor', function () {
    it('inflow must be Decimal', function () {
      assert.throws(
        /* eslint-disable no-new */
        () => { new Transaction({ inflow: 1.0 }); },
        /* eslint-enable no-new */
        LoonyInternalError, /inflow must be Decimal/);
    });

    it('outflow must be Decimal', function () {
      assert.throws(
        /* eslint-disable no-new */
        () => { new Transaction({ outflow: 1.0 }); },
        /* eslint-enable no-new */
        LoonyInternalError, /outflow must be Decimal/);
    });

    it('both inflow and outflow cannot be specified', function () {
      assert.throws(
        /* eslint-disable no-new */
        () => {
          new Transaction({
            inflow: new Decimal('1.0'),
            outflow: new Decimal('200'),
          });
        },
        /* eslint-enable no-new */
        LoonyInternalError, /Both outflow.*and inflow/);
    });

    it('both inflow and outflow can be zero', function () {
      const tx = new Transaction({
        outflow: new Decimal('0'),
        inflow: new Decimal('0'),
      });
      assert.equal(tx.amountMinor, 0);
    });

    it('outflow must be non-negative', function () {
      assert.throws(
        /* eslint-disable no-new */
        () => { new Transaction({ outflow: new Decimal('-100') }); },
        /* eslint-enable no-new */
        LoonyInternalError, /outflow can't be negative/);
    });

    it('inflow must be non-negative', function () {
      assert.throws(
        /* eslint-disable no-new */
        () => { new Transaction({ inflow: new Decimal('-100') }); },
        /* eslint-enable no-new */
        LoonyInternalError, /inflow can't be negative/);
    });

    it('amountMinor parsed from inflow', function () {
      const tx = new Transaction({ inflow: new Decimal('200') });
      assert(tx.amountMinor.eq('20000'));
    });

    it('amountMinor parsed from outflow', function () {
      const tx = new Transaction({ outflow: new Decimal('200') });
      assert(tx.amountMinor.eq('-20000'));
    });
  });  // ctor

  describe('outflow', function () {
    it('returns if outflow given', function () {
      const tx = new Transaction({ outflow: new Decimal('200') });
      assert(tx.outflow().eq('200'));
    });

    it('returns zero with zero outflow', function () {
      const tx = new Transaction({ outflow: new Decimal('0') });
      assert(tx.outflow().isZero());
    });

    it('returns zero if only inflow given', function () {
      const tx = new Transaction({ inflow: new Decimal('200') });
      assert(tx.outflow().isZero());
    });
  });  // outflow

  describe('inflow', function () {
    it('returns if inflow given', function () {
      const tx = new Transaction({ inflow: new Decimal('200') });
      assert(tx.inflow().eq('200'));
    });

    it('returns zero with zero inflow', function () {
      const tx = new Transaction({ inflow: new Decimal('0') });
      assert(tx.inflow().isZero());
    });

    it('returns zero if only outflow given', function () {
      const tx = new Transaction({ outflow: new Decimal('200') });
      assert(tx.inflow().isZero());
    });
  });  // inflow
});
