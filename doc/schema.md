# Database schema

Data will be stored in
[Firebase Realtime Database](https://firebase.google.com/docs/database/) in
the structure below. Increased indentation denotes children of a node.

```
// Describes each user and all of their data.
users/
  // Key provided by firebase.database.Reference.push() .
  $userId/
    budgets/
      $budgetId/
        options/
          // User-provided name for the budget.
          name str

          // The currency in which category budgets are maintained. Values are
          // ISO 4217 currency codes.
          primaryCurrency str


        // Describes a single account (e.g. checking account, cash, credit
        // card). Each transaction is linked to a single account.
        accounts/
          // Key provided by firebase.database.Reference.push() .
          $accountId/

            // Display name of the account provided by the user.
            name str

            // Currency in which transactions are made. Values are ISO 4217
            // currency codes. Currently treated as immutable.
            currency str

            // Whether the account appears in the UI and the user can attribute
            // transactions to it. Can be toggled by the user to hide accounts
            // that are no longer in use.
            isOpen bool


        // Source or receiving party of transactions.
        payees/
          // Provided by firebase.database.Reference.push() .
          $payeeId/

            // Display name of the payee provided by the user.
            name str

            // TODO: Store payee locations so that mobile apps can
            // auto-populate the payee for new transaction based on the
            // current location.


        // Purpose of a transaction.
        categories/
          // Provided by firebase.database.Reference.push() .
          $categoryId/
            // Display name of the account provided by the user.
            name str

            // Free-form remarks provided by the user.
            notes str

            // ID of the parent category. Categories can be nested. Matches
            // the keys of /users/$userId/categories/$categoryId/ . If a
            // category has any children, the values under budgets/ will be
            // ignored by the UI.
            parentId str

            // Whether to display the category on the UI. Can be toggled by the
            // user to hide categories that are no longer in use.
            isHidden bool

            // Desired maximum amount of outflow for a category in a given
            // month.
            budgets/
              // Keys provided by firebase.database.Reference.push() .
              $monthId/
                // "YYYY-MM"
                month str

                // Desired maximum outflow in the minor unit of the user's
                // primary currency (/users/$userId/options/primaryCurrency).
                amountMinor int

                // If true, outflows in excess of amountMinor will be
                // attributed against this category's budget in the following
                // month (a/k/a YNAB4 "red arrow"). If false, excess outflows
                // are deducted from total income of the following month.
                carryOverOverspending bool

                // Free-form remarks provided by the user.
                notes str


        // An expense or income.
        transactions/
          // Key provided by firebase.database.Reference.push() .
          $transactionId/
            // ID of the account with which to associate this transaction.
            // null if this transaction is a transfer between accounts; see
            // transferSrcAccountId and transferDstAccountId.
            accountId str

            // ID of the account to debit if this transaction is a transfer.
            // null if this transaction is not a transfer.
            transferSrcAccountId str

            // ID of the account to credit if this transaction is a transfer.
            // null if this transaction is not a transfer.
            transferDstAccountId str

            // Date of the transaction in milliseconds since the epoch.
            dateMs int

            // ID of the payee; corresponds to an entity in
            // /user/$userId/payees/ .
            payeeId str

            // Transaction amount in the minor units of the account's
            // currency. Negative if the account should be debited
            // ("outflow"); positive if the account should be credited
            // ("inflow"/"income"). This should be the sum of all categories'
            // amountMinor values.
            amountMinor int

            // Currency in which this transaction was originally conducted.
            // For instance, if the user is traveling to a foreign country
            // with their credit card and makes a transaction in the local
            // currency. This would be the "charged currency" differing from
            // the currency appearing on the account statement. Values are ISO
            // 4217 currency codes.
            chargedCurrency str

            // Amount of money transacted in the chargedCurrency.
            chargedCurrencyAmountMinor int

            // Free-form remarks provided by the user.
            memo str

            // Whether the transaction has been fully processed by the account's
            // financial institution. Set by the user.
            cleared bool

            // Whether the user has verified the balance of the cleared
            // transactions in Loony match the balance of the account. cleared
            // must also be true.
            reconciled bool

            // Categories with which to associate this transaction.
            categories/
              // Matches the keys of /users/$userId/categories/ .
              $categoryId/
                // Amount of the transaction attributable to this category in
                // minor units of the account's currency. The sum of all
                // categories' amountMinor values should equal amountMinor in
                // the transaction.
                amountMinor int

                // Amount transacted in the transaction's chargedCurrency if
                // present.
                chargedCurrencyAmountMinor int

                // If this transaction is an inflow, whether the amount is
                // available for use in the following month (see "YNAB Rule 4").
                incomeAvailableNextMonth bool

                // Payee that needs to reimburse the user for this transaction.
                // Matches keys in /users/$userId/payees/ .
                debtorId str


// TODO: Figure out how to migrate schemas gracefully and giving old clients
// some warning before introducing backwards-incompatible changes.
```
