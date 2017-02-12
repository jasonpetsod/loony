import Decimal from 'decimal.js-light';
import moment from 'moment';

import LoonyInternalError from './LoonyInternalError';

const TEST_ACCOUNT_ID = 'test-account-id';
const TEST_CATEGORY_ID = 'test-category-id';
const TEST_PAYEE_ID = 'test-payee-id';

export default class Transaction {
  static fromFirebaseData(key, data) {
    return new Transaction({
      id: key,
      // TODO(#10): Implement accounts.
      account: '',
      dateMs: data.dateMs,
      // TODO(#26): Implement payees.
      payee: '',
      // TODO(#9): Implement categories.
      category: '',
      memo: data.memo,
      amountMinor: new Decimal(data.amountMinor),
    });
  }

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

  firebaseData() {
    // TODO: Make this class more similar to the data model.
    return {
      // TODO: Support user-provided accounts.
      accountId: TEST_ACCOUNT_ID,
      // TODO: Support transfer transactions.
      transferSrcAccountId: null,
      transferDstAccountId: null,
      dateMs: this.dateMs,
      payeeId: TEST_PAYEE_ID,
      amountMinor: this.amountMinor.toNumber(),
      // TODO: Implement charged currency.
      chargedCurrency: null,
      chargedCurrencyAmountMinor: null,
      memo: this.memo,
      cleared: false,
      reconciled: false,
      categories: {
        [TEST_CATEGORY_ID]: {
          amountMinor: this.amountMinor.toNumber(),
          chargedCurrencyAmountMinor: null,
          // TODO: Implement rule 4.
          incomeAvailableNextMonth: false,
          // TODO: Implement debtors.
          debtorId: null,
        },
      },
    };
  }
}
