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
    print("database path = \(dbPath)")
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

  func insertAccountRecord(id: String, name: String) throws {
    let stmt = try model.db.prepare(
        "INSERT INTO accounts (id, name) VALUES (?, ?);")
    try stmt.run(id, name)
  }

  func testGetAccount_ByID() throws {
    try insertAccountRecord("a", name: "Foo")

    let account = model.getAccount(id: "a")
    XCTAssertNotNil(account)
    XCTAssertEqual("a", account!.id)
    XCTAssertEqual("Foo", account!.name)
  }

  func testGetAccount_ByID_Missing() throws {
    try insertAccountRecord("a", name: "Foo")

    let account = model.getAccount(id: "b")
    XCTAssertNil(account)
  }

  func testGetAccount_ByName() throws {
    try insertAccountRecord("a", name: "Foo")

    let account = model.getAccount(id: nil, name: "Foo")
    XCTAssertNotNil(account)
    XCTAssertEqual("a", account!.id)
    XCTAssertEqual("Foo", account!.name)
  }

  func testGetAccount_ByName_Missing() throws {
    try insertAccountRecord("a", name: "Foo")

    let account = model.getAccount(id: nil, name: "Bar")
    XCTAssertNil(account)
  }

  func testGetAccount_ByIDAndName() throws {
    try insertAccountRecord("a", name: "Foo")

    let account = model.getAccount(id: "a", name: "Foo")
    XCTAssertNotNil(account)
    XCTAssertEqual("a", account!.id)
    XCTAssertEqual("Foo", account!.name)
  }
  
  func testGetAccount_ByIDAndName_NeitherMatches() throws {
    try insertAccountRecord("a", name: "Foo")

    let account = model.getAccount(id: "x", name: "Bar")
    XCTAssertNil(account)
  }

  func testGetAccount_ByIDAndName_IDDoesNotMatch() throws {
    try insertAccountRecord("a", name: "Foo")

    let account = model.getAccount(id: "x", name: "Foo")
    XCTAssertNil(account)
  }

  func testGetAccount_ByIDAndName_NameDoesNotMatch() throws {
    try insertAccountRecord("a", name: "Foo")

    let account = model.getAccount(id: "a", name: "Bar")
    XCTAssertNil(account)
  }
}
