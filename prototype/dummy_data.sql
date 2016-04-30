DELETE FROM transaction_categories;
DELETE FROM transactions;
DELETE FROM category_budgets;
DELETE FROM categories;
DELETE FROM payees;
DELETE FROM accounts;

INSERT INTO accounts VALUES ('a-a', 'Account A');
INSERT INTO accounts VALUES ('a-b', 'Account B');

INSERT INTO payees VALUES ('p-a', 'Payee A');
INSERT INTO payees VALUES ('p-b', 'Payee B');

INSERT INTO categories (id, name) VALUES ('c-a', 'Category A');
INSERT INTO categories (id, name) VALUES ('c-b', 'Category B');


INSERT INTO transactions (id, account_id, date, payee_id)
    VALUES ('t-1', 'a-a', 1451624400, 'p-a');  -- 2016-01-01
INSERT INTO transaction_categories (transaction_id, category_id, amount_cents)
    VALUES ('t-1', 'c-a', -1000);

INSERT INTO transactions (id, account_id, date, payee_id)
    VALUES ('t-2', 'a-a', 1451710800, 'p-a');  -- 2016-01-02
INSERT INTO transaction_categories (transaction_id, category_id, amount_cents)
    VALUES ('t-2', 'c-a', -3000);
INSERT INTO transaction_categories (transaction_id, category_id, amount_cents)
    VALUES ('t-2', 'c-b', -5000);

INSERT INTO transactions (id, account_id, date, payee_id)
    VALUES ('t-3', 'a-b', 1451797200, 'p-b');  -- 2016-01-03
INSERT INTO transaction_categories (transaction_id, category_id, amount_cents)
    VALUES ('t-3', 'c-b', 10000);
