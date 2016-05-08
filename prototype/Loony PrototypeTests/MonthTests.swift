import Foundation
import XCTest
@testable import Loony_Prototype

class MonthTests: XCTestCase {
  func testInit_FromNSDate() {
    // Caveat: This only works when the current locale uses the Gregorian
    // calendar.
    // TODO: Stub out NSCalendar.currentCalendar().

    // Sat May  7 15:05:29 UTC 2016
    let month = Month(date: NSDate(timeIntervalSince1970: 1462633529))
    XCTAssertEqual(2016, month.year)
    XCTAssertEqual(5, month.month)
  }

  func testInit_FromUnixEpoch() {
    // Sat May  7 15:05:29 UTC 2016
    let month = Month(timeIntervalSince1970: 1462633529)
    XCTAssertEqual(2016, month.year)
    XCTAssertEqual(5, month.month)
  }

  func testTimeIntervalSince1970() {
    let month = Month(year: 2016, month: 5)
    XCTAssertEqual(1462060800, month.timeIntervalSince1970)
  }

  func testEq_Same() {
    XCTAssertEqual(Month(year: 2016, month: 5), Month(year: 2016, month: 5))
  }

  func testEq_DifferentYear() {
    XCTAssertNotEqual(Month(year: 1, month: 5), Month(year: 2016, month: 5))
  }

  func testEq_DifferentMonth() {
    XCTAssertNotEqual(Month(year: 2016, month: 1), Month(year: 2016, month: 5))
  }

  func testEq_DifferentYearAndMonth() {
    XCTAssertNotEqual(Month(year: 1, month: 1), Month(year: 2016, month: 5))
  }
}
