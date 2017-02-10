import moment from 'moment';

import LoonyInternalError from './LoonyInternalError';

const TEST_ACCOUNT_ID = 'test-account-id';
const TEST_CATEGORY_ID = 'test-category-id';
const TEST_PAYEE_ID = 'test-payee-id';

export default class Transaction {
  constructor({ id = null, account = '', dateMs = 0, payee = '', category = '',
                memo = '', outflow = 0.0, inflow = 0.0 }) {
    this.id = id;
    this.account = account;
    this.dateMs = dateMs;
    this.payee = payee;
    this.category = category;
    this.memo = memo;
    // TODO: Ensure outflow > 0 and inflow > 0.
    this.outflow = outflow;
    this.inflow = inflow;
  }

  prettyDate() {
    // TODO: Do we need to store dates according to the user's desired
    // timezone?
    return moment(this.dateMs).utc().format('YYYY-MM-DD');
  }

  amountMinor() {
    if (this.outflow && this.inflow) {
      throw new LoonyInternalError(
        `Both inflow and outflow specified: inflow=${this.inflow} outflow=${this.outflow}`);
    }
    if (this.outflow === 0.0 && this.inflow === 0.0) {
      return 0;
    }
    // TODO: Use a proper money library.
    // TODO: Support custom currencies.
    if (this.outflow !== 0.0) {
      return parseInt(this.outflow * -100, 10);
    } else if (this.inflow !== 0.0) {
      return parseInt(this.inflow * 100, 10);
    }
    throw new LoonyInternalError('Should not get here');
  }

  firebaseData() {
    return {
      // TODO: Support user-provided accounts.
      accountId: TEST_ACCOUNT_ID,
      // TODO: Support transfer transactions.
      transferSrcAccountId: null,
      transferDstAccountId: null,
      dateMs: this.dateMs,
      payeeId: TEST_PAYEE_ID,
      amountMinor: this.amountMinor(),
      // TODO: Implement charged currency.
      chargedCurrency: null,
      chargedCurrencyAmountMinor: null,
      memo: this.memo,
      cleared: false,
      reconciled: false,
      categories: {
        [TEST_CATEGORY_ID]: {
          amountMinor: this.amountMinor(),
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
