import Decimal from 'decimal.js-light';
import moment from 'moment';

import LoonyInternalError from './LoonyInternalError';

export default class Transaction {
  constructor({ id = null, account = '', dateMs = 0, payee = '', category = '',
                memo = '', outflow = new Decimal('0'),
                inflow = new Decimal('0') }) {
    this.id = id;
    this.account = account;
    this.dateMs = dateMs;
    this.payee = payee;
    this.category = category;
    this.memo = memo;

    if (!(inflow instanceof Decimal)) {
      throw new LoonyInternalError(`inflow must be Decimal: ${inflow}`);
    }
    if (!(outflow instanceof Decimal)) {
      throw new LoonyInternalError(`outflow must be Decimal: ${outflow}`);
    }

    if (!outflow.isZero() && !inflow.isZero()) {
      throw new LoonyInternalError(
          `Both outflow=${outflow} and inflow=${inflow} can't be specified`);
    }
    if (outflow.isNegative()) {
      throw new LoonyInternalError(`outflow can't be negative: ${outflow}`);
    }
    if (inflow.isNegative()) {
      throw new LoonyInternalError(`inflow can't be negative: ${outflow}`);
    }

    if (inflow.isZero() && outflow.isZero()) {
      this.amountMinor = new Decimal('0');
    } else if (inflow.isPositive()) {
      this.amountMinor = inflow.times(100);
    } else if (outflow.isPositive()) {
      this.amountMinor = outflow.times(-100);
    } else {
      throw new LoonyInternalError(
          `couldn't parse inflow=${inflow} or outflow=${outflow}`);
    }
  }

  prettyDate() {
    // TODO: Do we need to store dates according to the user's desired
    // timezone?
    return moment(this.dateMs).utc().format('YYYY-MM-DD');
  }

  inflow() {
    if (this.amountMinor >= 0) {
      // TODO: Support currencies besides USD.
      return this.amountMinor.dividedBy(100);
    }
    return new Decimal('0');
  }

  outflow() {
    if (this.amountMinor <= 0) {
      // TODO: Support currencies besides USD.
      return this.amountMinor.absoluteValue().dividedBy(100);
    }
    return new Decimal('0');
  }
}
