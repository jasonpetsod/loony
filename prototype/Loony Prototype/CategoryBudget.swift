import Foundation

class CategoryBudget {
  let month: Month
  let budgetCents: Int
  let carryOverOverspending: Bool
  let notes: String?

  init(month: Month, budgetCents: Int, carryOverOverspending: Bool,
       notes: String?) {
    self.month = month
    self.budgetCents = budgetCents
    self.carryOverOverspending = carryOverOverspending
    self.notes = notes
  }
}
