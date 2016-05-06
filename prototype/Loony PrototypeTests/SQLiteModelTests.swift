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
}
