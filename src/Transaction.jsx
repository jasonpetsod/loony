import Decimal from 'decimal.js-light';
import moment from 'moment';

import LoonyInternalError from './LoonyInternalError';

export default class Transaction {
  constructor({ id = null, account = '', dateMs = 0, payee = '', category = '',
                memo = '', amountMinor = new Decimal('0') }) {
    this.id = id;
    this.account = account;
    this.dateMs = dateMs;
    this.payee = payee;
    this.category = category;
    this.memo = memo;

    if (amountMinor instanceof Decimal === false) {
      throw new LoonyInternalError(`amountMinor isn't Decimal: ${amountMinor}`);
    }
    this.amountMinor = amountMinor;
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
