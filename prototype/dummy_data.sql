DELETE FROM transaction_categories;
DELETE FROM transactions;
DELETE FROM category_budgets;
DELETE FROM categories;
DELETE FROM payees;
DELETE FROM accounts;

INSERT INTO accounts VALUES ('a-a', 'Chase Sapphire');
INSERT INTO accounts VALUES ('a-b', 'Ally Checking');

INSERT INTO payees VALUES ('p-a', 'Mu Ramen');
INSERT INTO payees VALUES ('p-b', 'Google Inc.');

INSERT INTO categories (id, name) VALUES ('c-a', 'Restaurants');
INSERT INTO categories (id, name) VALUES ('c-b', 'Reimbursements');
INSERT INTO categories (id, name) VALUES ('c-c', 'Income');


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
    VALUES ('t-3', 'c-c', 10000);
