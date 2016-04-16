PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

BEGIN;

CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS payees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    parent_id TEXT,
    notes TEXT,
    hidden INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (parent_id) REFERENCES categories (id)
) WITHOUT ROWID;

-- TODO: add sequence number for determinism?
-- TODO: handle income for $THIS_MONTH, $NEXT_MONTH.
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    date TEXT NOT NULL,
    payee_id TEXT,
    transfer_src_account_id TEXT,
    transfer_dst_account_id TEXT,
    memo TEXT,
    cleared INTEGER DEFAULT 0,
    reconciled INTEGER DEFAULT 0,
    FOREIGN KEY (account_id) REFERENCES accounts (id),
    FOREIGN KEY (payee_id) REFERENCES payees (id)
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS transaction_categories (
    transaction_id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    income_month TEXT, -- TODO: hmmmmmmmm
    amount_cents INTEGER NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions (id),
    FOREIGN KEY (category_id) REFERENCES categories (id)
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS category_budgets (
    month TEXT PRIMARY KEY, -- first day of the month, 00:00:00.000
    category_id TEXT NOT NULL,
    budget_cents INTEGER NOT NULL DEFAULT 0,
    carry_over_overspending INTEGER DEFAULT 0, -- YNAB "red arrow"
    notes TEXT,
    FOREIGN KEY (category_id) REFERENCES categories (id)
) WITHOUT ROWID;

COMMIT;
