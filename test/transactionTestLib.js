// Helper routines for testing with Transaction objects.

import Decimal from 'decimal.js-light';

import Transaction from '../src/Transaction';

const defaultTransactionFields = {
  id: 'test-id',
  account: 'test-account',
  dateMs: 1483228800000,  // 2017-01-01 00:00 UTC
  payee: 'test-payee',
  category: 'test-category',
  memo: 'test-memo',
  amountMinor: new Decimal('1999'),
};

// Create a new Transaction for use in tests without needing to populate all
// of the fields in the ctor.
function newTx(fields) {
  return new Transaction({
    ...defaultTransactionFields,
    ...fields,
  });
}

export { newTx };  // eslint-disable-line import/prefer-default-export
