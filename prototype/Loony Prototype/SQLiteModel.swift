import SQLite

enum SQLiteModelError: ErrorType {
  case AccountNotFound
  case ConnectionFailure
  case EnableForeignKeysFailure
  case InsertFailure
  case PayeeNotFound
}

class SQLiteModel {
  let db: Connection

  let accountsTable = Table("accounts")
  let categoriesTable = Table("categories")
  let transactionCategoriesTable = Table("transaction_categories")
  let transactionsTable = Table("transactions")

  let accountIdCol = Expression<String>("account_id")
  let amountCentsCol = Expression<Int>("amount_cents")
  let categoryIdCol = Expression<String>("category_id")
  let dateCol = Expression<NSTimeInterval>("date")
  let idCol = Expression<String>("id")
  let nameCol = Expression<String>("name")
  let notesCol = Expression<String?>("notes")
  let parentIdCol = Expression<String?>("parent_id")
  let payeeIdCol = Expression<String>("payee_id")
  let transactionIdCol = Expression<String>("transaction_id")

  init() throws {
    do {
      db = try Connection("/Users/jason/dev/loony/prototype/loony.db")
    } catch {
      throw SQLiteModelError.ConnectionFailure
    }

    do {
      try db.execute("PRAGMA foreign_keys = ON;")
    } catch {
      throw SQLiteModelError.EnableForeignKeysFailure
    }
  }

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

  func addAccount(account: Account) throws {
    let insert = accountsTable.insert(
        idCol <- account.id, nameCol <- account.name)
    do {
      try db.run(insert)
    } catch {
      print("Failed to insert account: \(error)")
      throw SQLiteModelError.InsertFailure
    }
  }

  func getAccount(id: String?, name: String? = nil) throws -> Account {
    var query = accountsTable.select(idCol, nameCol)
    if id != nil {
      query = query.filter(idCol == id!)
    }
    if name != nil {
      query = query.filter(nameCol == name!)
    }
    if let account = db.pluck(query) {
      return Account(id: account[idCol], name: account[nameCol])
    } else {
      throw SQLiteModelError.AccountNotFound
    }
  }

  // MARK: Categories

  func addCategory(category: Category) throws {
    let insert = categoriesTable.insert(
        idCol <- category.id,
        nameCol <- category.name,
        parentIdCol <- category.parentId,
        notesCol <- category.notes)

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
                name searchName: String? = nil) throws -> Payee {
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
      throw SQLiteModelError.PayeeNotFound
    }
  }

  // MARK: Transactions

  func getTransactions() throws -> [Transaction] {
    let query = transactionsTable
        .select(transactionsTable[idCol],
                transactionsTable[accountIdCol],
                transactionsTable[dateCol],
                transactionsTable[payeeIdCol],
                transactionCategoriesTable[categoryIdCol],
                categoriesTable[nameCol],
                transactionCategoriesTable[amountCentsCol])
        .join(transactionCategoriesTable,
              on: transactionIdCol == transactionsTable[idCol])
        .join(categoriesTable,
              on: categoryIdCol == categoriesTable[idCol]);

    var transactions = [String: Transaction]()
    for row in try! db.prepare(query) {
      let id = row[idCol]

      let category = Category(
          id: row[transactionCategoriesTable[categoryIdCol]],
          name: row[categoriesTable[nameCol]],
          parentId: nil,
          notes: nil)

      let transactionCategory = TransactionCategory(
          category: category,
          amountCents: row[amountCentsCol])

      if var transaction = transactions[id] {
        // Add category to the transaction.
        transaction.categories.append(transactionCategory)
        transactions[id] = transaction
      } else {
        // Create a new transaction.
        let account = try getAccount(row[accountIdCol])
        let payee = try getPayee(id: row[payeeIdCol])
        let date = NSDate(timeIntervalSince1970: row[dateCol])
        let transaction = Transaction(id: row[idCol],
                                      account: account,
                                      date: date,
                                      payee: payee,
                                      memo: nil,
                                      categories: [transactionCategory])
        transactions[id] = transaction
      }
    }

    // TODO: Maybe sort result.
    return Array(transactions.values)
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
