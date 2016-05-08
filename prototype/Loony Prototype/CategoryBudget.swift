import Foundation

class CategoryBudget {
  // TODO: Do we need this property now that Category.budgets is a
  // Dictionary<Month, CategoryBudget>?
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

extension CategoryBudget: CustomDebugStringConvertible {
  var debugDescription: String {
    return
        "CategoryBudget<month:\(month) budgetCents:\(budgetCents) " +
        "carryOverOverspending:\(carryOverOverspending) "
        "notes:\(notes)>"
  }
}
