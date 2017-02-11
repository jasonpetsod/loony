import moment from 'moment';

export default class Transaction {
  constructor({ id = null, account = '', dateMs = 0, payee = '', category = '',
                memo = '', amountMinor = 0.0 }) {
    this.id = id;
    this.account = account;
    this.dateMs = dateMs;
    this.payee = payee;
    this.category = category;
    this.memo = memo;
    this.amountMinor = amountMinor;
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
