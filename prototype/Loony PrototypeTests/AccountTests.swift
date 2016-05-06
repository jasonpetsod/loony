import XCTest
@testable import Loony_Prototype

class AccountTests: XCTestCase {
  func testEq_True() {
    let a = Account(id: "x", name: "Foo")
    let b = Account(id: "x", name: "Foo")
    XCTAssertEqual(a, b)
  }

  func testEq_False() {
    let a = Account(id: "x", name: "Foo")
    let b = Account(id: "y", name: "Foo")
    XCTAssertNotEqual(a, b)
  }
}
