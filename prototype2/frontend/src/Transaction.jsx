import moment from 'moment';

export default class Transaction {
  constructor(fields) {
    this.id = fields.id || null;
    this.account = fields.account || '';
    this.dateMs = fields.dateMs || 0;
    this.payee = fields.payee || '';
    this.category = fields.category || '';
    this.memo = fields.memo || '';
    this.outflow = fields.outflow || 0.0;
    this.inflow = fields.inflow || 0.0;
  }

  prettyDate() {
    // TODO: Do we need to store dates according to the user's desired
    // timezone?
    return moment(this.dateMs).utc().format('YYYY-MM-DD');
  }
}
