import SQLite

enum SQLiteModelError: ErrorType {
  case AccountNotFound
  case ConnectionFailure
  case EnableForeignKeysFailure
  case InsertFailure
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
  let dateCol = Expression<String>("date")
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

  func addAccount(account: Account) throws {
    let insert = accountsTable.insert(
        idCol <- account.id, nameCol <- account.name)
    do {
      var rowid = try db.run(insert)
    } catch {
      throw SQLiteModelError.InsertFailure
    }
  }

  func getAccount(id: String) throws -> Account {
    let query = accountsTable.select(idCol, nameCol).filter(idCol == id);
    if let account = try db.pluck(query) {
      return Account(id: id, name: account[nameCol])
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
      throw SQLiteModelError.InsertFailure
    }
  }

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
        let transaction = Transaction(id: row[idCol],
                                      account: account,
                                      date: row[dateCol],
                                      payeeId: row[payeeIdCol],
                                      memo: nil,
                                      categories: [category])
        transactions[id] = transaction
      }
    }

    // TODO: Maybe sort result.
    return Array(transactions.values)
  }
}
