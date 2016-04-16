import SQLite

enum SQLiteModelError: ErrorType {
  case ConnectionFailure
  case InsertFailure
}

class SQLiteModel {
  let db: Connection

  let accountsTable = Table("accounts")
  let idCol = Expression<String>("id")
  let nameCol = Expression<String>("name")

  init() throws {
    do {
      db = try Connection("/Users/jason/dev/loony/prototype/loony.db")
    } catch {
      throw SQLiteModelError.ConnectionFailure
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
}
