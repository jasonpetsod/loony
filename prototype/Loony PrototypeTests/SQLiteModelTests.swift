import SQLite
import XCTest
@testable import Loony_Prototype

class SQLiteModelTests: XCTestCase {
  var model: SQLiteModel! = nil
  var tempDir: NSString! = nil

  func setUpBackend() throws {
    tempDir = (NSTemporaryDirectory() as NSString)
        .stringByAppendingPathComponent(NSUUID().UUIDString)
    // TODO: Fail if directory exists.
    try NSFileManager.defaultManager().createDirectoryAtPath(
        tempDir as String, withIntermediateDirectories: true, attributes: nil)

    let dbPath = tempDir.stringByAppendingPathComponent("test.sqlite3")
    model = try SQLiteModel(databasePath: dbPath)

    // TODO: Include db.sql as a test dependency.
    let schema = try NSString(
        contentsOfFile: "/Users/jason/dev/loony/prototype/db.sql",
        encoding: NSASCIIStringEncoding)
    try model.db.execute(schema as String)
  }

  override func setUp() {
    super.setUp()

    do {
      try setUpBackend()
    } catch {
      XCTFail("Could not set up SQLite backend: \(error)")
    }
  }

  override func tearDown() {
    super.tearDown()

    // TODO: Delete tempDir.
  }

  // MARK: Fake database record helpers

  func insertAccountWithID(id: String, name: String) throws {
    let stmt = try model.db.prepare(
        "INSERT INTO accounts (id, name) VALUES (?, ?);")
    try stmt.run(id, name)
  }
 
  func insertPayeeWithID(id: String, name: String) throws {
    let stmt = try model.db.prepare(
        "INSERT INTO payees (id, name) VALUES (?, ?);")
    try stmt.run(id, name)
  }

  func insertCategoryWithID(id: String, name: String) throws {
    let stmt = try model.db.prepare(
        "INSERT INTO categories (id, name) VALUES (?, ?);")
    try stmt.run(id, name)
  }

  func insertTransactionWithID(id: String, accountID: String, date: Int,
                               payeeID: String) throws {
    let stmt = try model.db.prepare(
        "INSERT INTO transactions (id, account_id, date, payee_id) " +
        "VALUES (?, ?, ?, ?);")
    try stmt.run(id, accountID, date, payeeID)
  }

  func insertTransactionCategoryWithTransactionID(
      txID: String, categoryID: String, amountCents: Int) throws {
    let stmt = try model.db.prepare(
        "INSERT INTO transaction_categories " +
        "(transaction_id, category_id, amount_cents) " +
        "VALUES (?, ?, ?);")
    try stmt.run(txID, categoryID, amountCents)
  }

  func insertCategoryBudgetWithCategoryID(
      categoryID: String, month: Month, budgetCents: Int,
      carryOverOverspending: Bool) throws {
    let stmt = try model.db.prepare(
        "INSERT INTO category_budgets " +
        "(month, category_id, budget_cents, carry_over_overspending) " +
        "VALUES (?, ?, ?, ?);")
    try stmt.run(month.timeIntervalSince1970, categoryID, budgetCents,
                 carryOverOverspending)
  }

  // MARK: Account tests

  func testAddAccount() throws {
    let account = Account(id: "x", name: "Account", isNew: false)
    try model.addAccount(account)

    let accounts = Table("Accounts")
    let id = Expression<String>("id")
    let name = Expression<String>("name")

    let results = Array(try model.db.prepare(accounts))
    XCTAssertEqual(1, results.count)
    XCTAssertEqual("x", results[0][id])
    XCTAssertEqual("Account", results[0][name])
  }

  func testGetAccount_ByID() throws {
    try insertAccountWithID("a", name: "Foo")

    let account = model.getAccount(id: "a")
    XCTAssertNotNil(account)
    XCTAssertEqual("a", account!.id)
    XCTAssertEqual("Foo", account!.name)
  }

  func testGetAccount_ByID_Missing() throws {
    try insertAccountWithID("a", name: "Foo")

    let account = model.getAccount(id: "b")
    XCTAssertNil(account)
  }

  func testGetAccount_ByName() throws {
    try insertAccountWithID("a", name: "Foo")

    let account = model.getAccount(id: nil, name: "Foo")
    XCTAssertNotNil(account)
    XCTAssertEqual("a", account!.id)
    XCTAssertEqual("Foo", account!.name)
  }

  func testGetAccount_ByName_Missing() throws {
    try insertAccountWithID("a", name: "Foo")

    let account = model.getAccount(id: nil, name: "Bar")
    XCTAssertNil(account)
  }

  func testGetAccount_ByIDAndName() throws {
    try insertAccountWithID("a", name: "Foo")

    let account = model.getAccount(id: "a", name: "Foo")
    XCTAssertNotNil(account)
    XCTAssertEqual("a", account!.id)
    XCTAssertEqual("Foo", account!.name)
  }
  
  func testGetAccount_ByIDAndName_NeitherMatches() throws {
    try insertAccountWithID("a", name: "Foo")

    let account = model.getAccount(id: "x", name: "Bar")
    XCTAssertNil(account)
  }

  func testGetAccount_ByIDAndName_IDDoesNotMatch() throws {
    try insertAccountWithID("a", name: "Foo")

    let account = model.getAccount(id: "x", name: "Foo")
    XCTAssertNil(account)
  }

  func testGetAccount_ByIDAndName_NameDoesNotMatch() throws {
    try insertAccountWithID("a", name: "Foo")

    let account = model.getAccount(id: "a", name: "Bar")
    XCTAssertNil(account)
  }

  // MARK: Transaction tests

  func testGetTransactions_SingleTransaction() throws {
    try self.insertAccountWithID("acct", name: "Account A")
    try self.insertPayeeWithID("mu", name: "Mu Ramen")
    try self.insertCategoryWithID("rst", name: "Restaurants")

    try model.db.transaction {
      try self.insertTransactionWithID(
          "tx", accountID: "acct", date: 1462578767, payeeID: "mu")
      try self.insertTransactionCategoryWithTransactionID(
          "tx", categoryID: "rst", amountCents: 5000)
    }

    let expectedAccount = Account(id: "acct", name: "Account A")
    let expectedDate = NSDate(timeIntervalSince1970: 1462578767)
    let expectedPayee = Payee(id: "mu", name: "Mu Ramen", isNew: false)
    let expectedCategory = Category(
        id: "rst", name: "Restaurants", parentId: nil, budgets: nil, notes: nil)
    let expectedTxCategory = TransactionCategory(
        category: expectedCategory, amountCents: 5000)
    let expectedTransaction = Transaction(
        id: "tx", account: expectedAccount, date: expectedDate,
        payee: expectedPayee, memo: nil, categories: [expectedTxCategory])

    let results = try model.getTransactions()
    XCTAssertEqual(1, results.count)
    XCTAssertEqual(expectedTransaction, results[0])
  }

  // MARK: Category tests

  func testGetCategories_NoCategories() throws {
    let results = try model.getCategories()
    XCTAssertEqual(0, results.count)
  }

  func testGetCategories_NoBudgets() throws {
    try self.insertCategoryWithID("a", name: "Category A")
    try self.insertCategoryWithID("b", name: "Category B")

    let expectedA = Category(id: "a", name: "Category A", parentId: nil,
                             budgets: [:], notes: nil)
    let expectedB = Category(id: "b", name: "Category B", parentId: nil,
                             budgets: [:], notes: nil)

    let results = try model.getCategories()
    XCTAssertEqual(2, results.count)
    XCTAssertEqual(expectedA, results[0])
    XCTAssertEqual(expectedB, results[1])
  }

  func testGetCategories_OneBudget() throws {
    try self.insertCategoryWithID("a", name: "Category A")
    try self.insertCategoryBudgetWithCategoryID(
        "a", month: Month(year: 2016, month: 5), budgetCents: 1000,
        carryOverOverspending: false)

    let expectedMonth = Month(year: 2016, month: 5)
    let expectedCategoryBudget = CategoryBudget(
        month: expectedMonth, budgetCents: 1000, carryOverOverspending: false,
        notes: nil)
    let expectedCategory = Category(
        id: "a", name: "Category A", parentId: nil,
        budgets: [expectedMonth: expectedCategoryBudget],
        notes: nil)

    let results = try model.getCategories()
    XCTAssertEqual(1, results.count)
    XCTAssertEqual(expectedCategory, results[0])
  }

  func testGetCategories_ManyBudgets() throws {
    try self.insertCategoryWithID("a", name: "Category A")
    try self.insertCategoryBudgetWithCategoryID(
        "a", month: Month(year: 2016, month: 4), budgetCents: 9999,
        carryOverOverspending: false)
    try self.insertCategoryBudgetWithCategoryID(
        "a", month: Month(year: 2016, month: 5), budgetCents: 1000,
        carryOverOverspending: false)

    try self.insertCategoryWithID("b", name: "Category B")
    try self.insertCategoryBudgetWithCategoryID(
        "b", month: Month(year: 2016, month: 3), budgetCents: 1234,
        carryOverOverspending: true)
    try self.insertCategoryBudgetWithCategoryID(
        "b", month: Month(year: 2016, month: 9), budgetCents: 5678,
        carryOverOverspending: true)

    let april = Month(year: 2016, month: 4)
    let may = Month(year: 2016, month: 5)
    let expectedA = Category(
        id: "a",
        name: "Category A",
        parentId: nil,
        budgets: [
            april: CategoryBudget(
                month: april,
                budgetCents: 9999,
                carryOverOverspending: false,
                notes: nil),
            may: CategoryBudget(
                month: may,
                budgetCents: 1000,
                carryOverOverspending: false,
                notes: nil),
        ],
        notes: nil)

    let march = Month(year: 2016, month: 3)
    let september = Month(year: 2016, month: 9)
    let expectedB = Category(
        id: "b",
        name: "Category B",
        parentId: nil,
        budgets: [
            march: CategoryBudget(
                month: march,
                budgetCents: 1234,
                carryOverOverspending: true,
                notes: nil),
            september: CategoryBudget(
                month: september,
                budgetCents: 5678,
                carryOverOverspending: true,
                notes: nil),
        ],
        notes: nil)

    let expectedResults = [expectedA, expectedB]

    let results = try model.getCategories()
    XCTAssertEqual(expectedResults, results)
  }
}
