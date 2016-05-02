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

  func transaction(block: () throws -> Void) {
    do {
      try db.transaction {
        try block()
      }
    } catch {
      print("Failed to execute transaction: \(error)")
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

      let category = TransactionCategory(
          categoryId: row[transactionCategoriesTable[categoryIdCol]],
          categoryName: row[categoriesTable[nameCol]],
          amountCents: row[amountCentsCol])

      if var transaction = transactions[id] {
        // Add category to the transaction.
        transaction.categories.append(category)
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
                                      categories: [category])
        transactions[id] = transaction
      }
    }

    // TODO: Maybe sort result.
    return Array(transactions.values)
  }
}
