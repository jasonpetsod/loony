import SQLite

enum SQLiteModelError: ErrorType {
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
    // SELECT transactions.id, transactions.account_id,
    //        transactions.date, transactions.payee_id,
    //        transaction_categories.category_id,
    //        transaction_categories.amount_cents
    // FROM transactions, transaction_categories
    // WHERE transactions.id = transaction_categories.transaction_id;

    let query = transactionsTable
        .select(idCol, accountIdCol, dateCol, payeeIdCol)
        .join(transactionCategoriesTable,
              on: transactionIdCol == transactionsTable[idCol]);

    var result = [Transaction]()

    print("Transactions:")
    for transaction in try! db.prepare(query) {
      result.append(Transaction(id: transaction[idCol],
                                accountId: transaction[accountIdCol],
                                date: transaction[dateCol],
                                payeeId: transaction[payeeIdCol],
                                memo: nil))
    }
    return result
  }
}
