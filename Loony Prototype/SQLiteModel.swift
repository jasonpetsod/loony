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

  let idCol = Expression<String>("id")
  let nameCol = Expression<String>("name")
  let notesCol = Expression<String?>("notes")
  let parentIdCol = Expression<String?>("parent_id")

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
}
