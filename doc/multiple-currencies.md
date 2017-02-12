# Multiple currency support

February 2017

## Objective

Loony should have first-class support for handling transactions and accounts
in different currencies. These are the workflows that we will support:

1.  Transactions that are charged in a currency different from the base
    currency of the account.
1.  Calculate outflows of category budgets where transactions are in different
    currencies.
1.  Transfer money between accounts of differing currencies.

## Conventions

We use the phrases "traveling" and "not traveling" in this document to refer
to the times when users are adding transactions in a foreign currency and the
base currency, respectively. Obviously there are times when a user may make
transactions not in the base currency even when they're physically in their
"home" country and not actually traveling; we use this imprecise terminology
as shorthand to facilitate sentence construction that's less awkward and more
natural.

## Transactions

Every bank account or credit card has a notion of a "base currency": the
currency the financial institution uses when executing transactions. Suppose
you have a credit card that's issued by a financial institution in the USA. If
you go to Japan and charge purchases to the credit card, the purchases will be
listed on your credit card statement in USD, not JPY.

Our users should be able to add transactions in the local currency when
they're traveling since that's the currency they'll be dealing with, not the
base currency of the account. But we also need to be able to reconcile these
transactions against the bank statement.

To support this use case:

*   Each account will have a base currency. The user will specify this when
    creating a new account.
*   Each transaction will have fields for the amount in the base currency and
    the charged currency (i.e. the local currency when traveling). There will
    also be a field for the type of charged currency.

When not traveling the user will enter transactions in the base currency and
leave the charged currency blank. Account reconciliation is just a matter of
comparing the bank statement and the ledger in Loony.

When traveling the user will enter transactions in the charged currency, the
type of charged currency, and leave the base currency blank. When the
transactions in the foreign currencies clear and are present on the user's
bank statement, the user will enter the cleared amount in the base currency
into the transaction. A transaction cannot be marked as cleared or reconciled
until the amount in the base currency is entered.

## Transfers between accounts

When transferring money between accounts of differing currencies the user
will enter the outflow from the source account. This will be stored as the
base currency amount in the transaction. Once the transfer clears the
destination account the user will enter the inflow in the destination account.
This will be stored as the charged currency amount in the same transaction. A
transfer transaction can't be marked as cleared until both base and charged
amounts are entered (same as non-transfer transactions).

## Category budgets

Even though transactions and accounts can have different currencies, all
category budgets need to be represented in a single currency. If this is not
the case it will be impossible for users to understand and make changes to
their category budgets.

The budget (i.e. the collection of all accounts, transactions, categories, and
category budgets) will have a single base currency. The user will specify all
category budget values in this base currency.

Transactions within a category can of course be linked to different accounts.
These accounts may have different base currencies. When calculating the
outflow for the category, we will sum up the transaction amounts by currency
and then convert all amounts into the base currency (see "Exchange rates"
below). If some transactions only have an amount in the charged currency and
not an amount in the base currency (i.e. these transactions haven't cleared
yet), we will also convert these transactions to the base currency.

Finally, when traveling it would be useful to show the remaining balance of a
category budget in the local currency. Once the category outflow is computed
in the base currency we can convert the outflows and balances to the local
currency.

TODO: How do we generate and store the precomputations for reports with
different currencies?

## Exchange rates

We have many calculations where we'll need to take exchange rates into
consideration:

*   income
*   available to budget
*   net worth
*   category outflows: transactions within a category can span accounts with
    different currencies
*   category balance: the category's outflows are subtracted from the
    category's budgeted amount (defined in the base currency of the budget)

We can compute a historical realized exchange rate (HRER) between two accounts:
the sum of the transfers out of the source account (in the source's base
currency) divided by the sum of the transfers into the destination account (in
the destination's base currency). We can also compute a HRER for a pair of
currencies within an account by dividing the sum of the transaction amounts in
the base currency by the sum of the transaction amounts in the alternate
currency.

Inflows into an account can either be income or transfers from another
account. Calculating the outflow in the base currency depends on the
composition of the account.

In an account that's purely funded by transfers, we use the HRER at the time
of the outflow to compute the outflow in the base currency:

1.  Transfer 100 USD to 80 EUR (1.25 USD = 1 EUR).
1.  Spend 20 EUR. Even if the market rate changes, it's still worth 25 USD to
    us.

In an account that's purely funded by income, we use the market rate to
compute the outflow in the base currency:

1.  Acquire 100 EUR.
1.  Spend 20 EUR. Outflow in USD depends on the market rate of the day.

TODO: How to compute the outflow in the budget base currency if an account has
both transfers and income?
