import SQLite

// TODO: Move this to the Application Support directory.
let defaultDatabasePath = "/Users/jason/dev/loony/prototype/loony.db"

enum SQLiteModelError: ErrorType {
  case AccountNotFound(accountId: String)
  case ConnectionFailure(message: String)
  case InsertFailure
  case PayeeNotFound(payeeId: String)
}

class SQLiteModel {
  let db: Connection

  // MARK: Initializers

  init(databasePath: String = defaultDatabasePath) throws {
    do {
      db = try Connection(databasePath)
      try db.execute("PRAGMA foreign_keys = ON;")
    } catch Result.Error(let error) {
      print("Could not connect to \(databasePath): \(error.message)")
      throw SQLiteModelError.ConnectionFailure(message: error.message)
    }
  }

  // MARK: Database functions

  func transaction(block: () throws -> Void) throws {
    do {
      try db.savepoint {
        try block()
      }
    } catch {
      print("Failed to execute transaction: \(error)")
      throw error
    }
  }

  // MARK: Accounts

  func addAccount(account: Account) throws {
    let accounts = Table("accounts")
    let id = Expression<String>("id")
    let name = Expression<String>("name")

    let insert = accounts.insert(id <- account.id, name <- account.name)
    do {
      try db.run(insert)
    } catch {
      print("Failed to insert account: \(error)")
      throw SQLiteModelError.InsertFailure
    }
  }

  func getAccount(id searchId: String?,
                  name searchName: String? = nil) -> Account? {
    let accounts = Table("accounts")
    let id = Expression<String>("id")
    let name = Expression<String>("name")

    var query = accounts.select(id, name)
    if let searchId = searchId {
      query = query.filter(id == searchId)
    }
    if let searchName = searchName {
      query = query.filter(name == searchName)
    }
    if let account = db.pluck(query) {
      return Account(id: account[id], name: account[name])
    } else {
      return nil
    }
  }

  // MARK: Categories

  func addCategory(category: Category) throws {
    let categories = Table("categories")
    let id = Expression<String>("id")
    let name = Expression<String>("name")
    let parentId = Expression<String?>("parent_id")
    let notes = Expression<String?>("notes")

    let insert = categories.insert(
        id <- category.id,
        name <- category.name,
        parentId <- category.parentId,
        notes <- category.notes)

    do {
      try db.run(insert)
    } catch {
      print("Failed to insert category: \(error)")
      throw SQLiteModelError.InsertFailure
    }
  }

  func getCategory(id searchId: String? = nil,
                   name searchName: String? = nil) -> Category? {
    let categories = Table("categories")
    let id = Expression<String>("id")
    let name = Expression<String>("name")

    var query = categories.select(id, name)
    if let searchId = searchId {
      query = query.filter(id == searchId)
    }
    if let searchName = searchName {
      query = query.filter(name == searchName)
    }
    if let row = db.pluck(query) {
      return Category(id: row[id], name: row[name], parentId: nil, notes: nil)
    } else {
      return nil
    }
  }

  // MARK: Payees

  func addPayee(payee: Payee) throws {
    let payees = Table("payees")
    let id = Expression<String>("id")
    let name = Expression<String>("name")

    let insert = payees.insert(
        id <- payee.id,
        name <- payee.name)

    do {
      try db.run(insert)
    } catch {
      print("Failed to insert payee: \(error)")
      throw SQLiteModelError.InsertFailure
    }
  }

  func getPayee(id searchId: String?,
                name searchName: String? = nil) -> Payee? {
    let payees = Table("payees")
    let id = Expression<String>("id")
    let name = Expression<String>("name")

    var query = payees.select(id, name)
    if searchId != nil {
      query = query.filter(id == searchId!)
    }
    if searchName != nil {
      query = query.filter(name == searchName!)
    }

    if let result = db.pluck(query) {
      return Payee(id: result[id], name: result[name], isNew: false)
    } else {
      return nil
    }
  }

  // MARK: Transactions

  func getTransactions() throws -> [Transaction] {
    let transactions = Table("transactions")

    let id = Expression<String>("id")
    let date = Expression<NSTimeInterval>("date")
    let payeeId = Expression<String>("payee_id")
    let categoryId = Expression<String>("category_id")
    let accountId = Expression<String>("account_id")
    let name = Expression<String>("name")
    let amountCents = Expression<Int>("amount_cents")
    let transactionId = Expression<String>("transaction_id")

    let transactionCategories = Table("transaction_categories")
    let categories = Table("categories")

    let query = transactions
        .select(transactions[id],
                transactions[accountId],
                transactions[date],
                transactions[payeeId],
                transactionCategories[categoryId],
                categories[name],
                transactionCategories[amountCents])
        .join(transactionCategories,
              on: transactionId == transactions[id])
        .join(categories,
              on: categoryId == categories[id]);

    var result = [String: Transaction]()
    for row in try! db.prepare(query) {
      let txId = row[id]

      let category = Category(
          id: row[transactionCategories[categoryId]],
          name: row[categories[name]],
          parentId: nil,
          notes: nil)

      let transactionCategory = TransactionCategory(
          category: category,
          amountCents: row[amountCents])

      if var transaction = result[txId] {
        // Add category to the transaction.
        transaction.categories.append(transactionCategory)
        result[txId] = transaction
      } else {
        // Create a new transaction.

        // These should never happen unless foreign key constraints aren't met.
        // TODO: Consider moving these queries into the join query above.
        guard let account = getAccount(id: row[accountId]) else {
          throw SQLiteModelError.AccountNotFound(accountId: row[accountId])
        }
        guard let payee = getPayee(id: row[payeeId]) else {
          throw SQLiteModelError.PayeeNotFound(payeeId: row[payeeId])
        }

        // TODO: Don't recreate Account and Payee instances if they've already
        // been seen.

        let date = NSDate(timeIntervalSince1970: row[date])
        let transaction = Transaction(id: txId,
                                      account: account,
                                      date: date,
                                      payee: payee,
                                      memo: nil,
                                      categories: [transactionCategory])
        result[txId] = transaction
      }
    }

    // TODO: Maybe sort result.
    return Array(result.values)
  }

  func addTransaction(transaction: Transaction) throws {
    let transactions = Table("transactions")

    let id = Expression<String>("id")
    let accountId = Expression<String>("account_id")
    let date = Expression<Double>("date")
    let payeeId = Expression<String>("payee_id")
    let memo = Expression<String?>("memo")

    let transactionInsert = transactions.insert(
        id <- transaction.id,
        accountId <- transaction.account.id,
        date <- transaction.date.timeIntervalSince1970,
        payeeId <- transaction.payee.id,
        memo <- transaction.memo)

    let transactionCategories = Table("transaction_categories")
    let transactionId = Expression<String>("transaction_id")
    let categoryId = Expression<String>("category_id")
    let amountCents = Expression<Int>("amount_cents")

    // TODO: Support multiple transaction categories.
    let txCategoryInsert = transactionCategories.insert(
        transactionId <- transaction.id,
        categoryId <- transaction.categories[0].category.id,
        amountCents <- transaction.categories[0].amountCents)

    do {
      try db.savepoint {
        print("transactionInsert = \(transactionInsert)")
        try self.db.run(transactionInsert)
        print("txCategoryInsert = \(txCategoryInsert)")
        try self.db.run(txCategoryInsert)
      }
    } catch {
      print("Failed to insert transaction: \(error)")
      throw SQLiteModelError.InsertFailure
    }
  }
}
