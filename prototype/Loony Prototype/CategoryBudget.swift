import Foundation

class CategoryBudget {
  let month: Month
  let category: Category
  let budgetCents: Int
  let carryOverOverspending: Bool
  let notes: String

  init(month: Month, category: Category, budgetCents: Int,
       carryOverOverspending: Bool, notes: String) {
    self.month = month
    self.category = category
    self.budgetCents = budgetCents
    self.carryOverOverspending = carryOverOverspending
    self.notes = notes
  }
}
