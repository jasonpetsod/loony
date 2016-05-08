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

extension CategoryBudget: Equatable {
}

func ==(lhs: CategoryBudget, rhs: CategoryBudget) -> Bool {
  return (lhs.month == rhs.month &&
          lhs.budgetCents == rhs.budgetCents &&
          lhs.carryOverOverspending == rhs.carryOverOverspending &&
          lhs.notes == rhs.notes)
}
