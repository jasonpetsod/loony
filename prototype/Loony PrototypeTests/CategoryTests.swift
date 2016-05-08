import XCTest
@testable import Loony_Prototype

class CategoryTests: XCTestCase {
  func testEq_BothNilBudgets() {
    let a = Category(
        id: "foo", name: "foo", parentId: nil, budgets: nil, notes: nil)
    let b = Category(
        id: "foo", name: "foo", parentId: nil, budgets: nil, notes: nil)
    XCTAssertEqual(a, b)
  }

  func testEq_LHSNilBudgets_RHSNonNilBudgets() {
    let budgets = [
        CategoryBudget(
            month: Month(year: 2016, month: 5),
            budgetCents: 9999,
            carryOverOverspending: false,
            notes: "foo"),
        CategoryBudget(
            month: Month(year: 2016, month: 5),
            budgetCents: 1000,
            carryOverOverspending: false,
            notes: nil),
    ]
    let a = Category(
        id: "foo", name: "foo", parentId: nil, budgets: nil, notes: nil)
    let b = Category(
        id: "foo", name: "foo", parentId: nil, budgets: budgets, notes: nil)
    XCTAssertNotEqual(a, b)
  }

  func testEq_LHSNonNilBudgets_RHSNilBudgets() {
    let budgets = [
        CategoryBudget(
            month: Month(year: 2016, month: 5),
            budgetCents: 9999,
            carryOverOverspending: false,
            notes: "foo"),
        CategoryBudget(
            month: Month(year: 2016, month: 5),
            budgetCents: 1000,
            carryOverOverspending: false,
            notes: nil),
    ]
    let a = Category(
        id: "foo", name: "foo", parentId: nil, budgets: budgets, notes: nil)
    let b = Category(
        id: "foo", name: "foo", parentId: nil, budgets: nil, notes: nil)
    XCTAssertNotEqual(a, b)
  }

  func testEq_SameBudgets() {
    let budgets = [
        CategoryBudget(
            month: Month(year: 2016, month: 5),
            budgetCents: 9999,
            carryOverOverspending: false,
            notes: "foo"),
        CategoryBudget(
            month: Month(year: 2016, month: 5),
            budgetCents: 1000,
            carryOverOverspending: false,
            notes: nil),
    ]
    let a = Category(
        id: "foo", name: "foo", parentId: nil, budgets: budgets, notes: nil)
    let b = Category(
        id: "foo", name: "foo", parentId: nil, budgets: budgets, notes: nil)
    XCTAssertEqual(a, b)
  }
}
