DELETE FROM accounts;
INSERT INTO accounts VALUES ('a-a', 'Account A');
INSERT INTO accounts VALUES ('a-b', 'Account B');

DELETE FROM payees;
INSERT INTO payees VALUES ('p-a', 'Payee A');
INSERT INTO payees VALUES ('p-b', 'Payee B');

DELETE FROM categories;
INSERT INTO categories (id, name) VALUES ('c-a', 'Category A');
INSERT INTO categories (id, name) VALUES ('c-b', 'Category B');

DELETE FROM transactions;
DELETE FROM transaction_categories;

INSERT INTO transactions (id, account_id, date, payee_id)
    VALUES ('t-1', 'a-a', '2016-01-01 00:00:00.000', 'p-a');
INSERT INTO transaction_categories (transaction_id, category_id, amount_cents)
    VALUES ('t-1', 'c-a', -1000);

INSERT INTO transactions (id, account_id, date, payee_id)
    VALUES ('t-2', 'a-a', '2016-01-02 00:00:00.000', 'p-a');
INSERT INTO transaction_categories (transaction_id, category_id, amount_cents)
    VALUES ('t-2', 'c-a', -3000);
INSERT INTO transaction_categories (transaction_id, category_id, amount_cents)
    VALUES ('t-2', 'c-b', -5000);

INSERT INTO transactions (id, account_id, date, payee_id)
    VALUES ('t-3', 'a-b', '2016-01-03 00:00:00.000', 'p-b');
INSERT INTO transaction_categories (transaction_id, category_id, amount_cents)
    VALUES ('t-3', 'c-b', 10000);
