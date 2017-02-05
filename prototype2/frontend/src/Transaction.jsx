export default class Transaction {
  constructor(fields) {
    this.id = fields.id || null;
    this.account = fields.account;
    this.dateMs = fields.dateMs;
    this.payee = fields.payee;
    this.category = fields.category;
    this.memo = fields.memo || '';
    this.outflow = fields.outflow || 0.0;
    this.inflow = fields.inflow || 0.0;
  }
}
