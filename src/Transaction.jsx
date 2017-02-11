import moment from 'moment';

import LoonyInternalError from './LoonyInternalError';

export default class Transaction {
  constructor({ id = null, account = '', dateMs = 0, payee = '', category = '',
                memo = '', outflow = 0.0, inflow = 0.0 }) {
    this.id = id;
    this.account = account;
    this.dateMs = dateMs;
    this.payee = payee;
    this.category = category;
    this.memo = memo;

    if (outflow !== 0.0 && inflow !== 0.0) {
      throw new LoonyInternalError(
          `Both outflow=${outflow} and inflow=${inflow} can't be specified`);
    }
    if (outflow < 0) {
      throw new LoonyInternalError(`outflow can't be negative: ${outflow}`);
    }
    if (inflow < 0) {
      throw new LoonyInternalError(`inflow can't be negative: ${outflow}`);
    }

    if (inflow === 0 && outflow === 0) {
      this.amountMinor = 0;
    } else if (inflow > 0) {
      // TODO: Stop using floats for money.
      this.amountMinor = inflow * 100;
    } else if (outflow > 0) {
      // TODO: Stop using floats for money.
      this.amountMinor = -1 * outflow * 100;
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
      // TODO: Stop using floats for money.
      return this.amountMinor / 100;
    }
    return 0;
  }

  outflow() {
    if (this.amountMinor <= 0) {
      // TODO: Stop using floats for money.
      return Math.abs(this.amountMinor) / 100;
    }
    return 0;
  }
}
