import Foundation

class Category {
  let id: String
  var name: String
  var parentId: String?
  // nil means the budgets haven't been populated from the backend.
  var budgets: [CategoryBudget]?
  var notes: String?
  var hidden: Bool

  init(id: String, name: String, parentId: String?, budgets: [CategoryBudget]?,
       notes: String?, hidden: Bool = false) {
    self.id = id
    self.name = name
    self.parentId = parentId
    self.budgets = budgets
    self.notes = notes
    self.hidden = hidden
  }

  convenience init(name: String, parent: Category?) {
    self.init(id: NSUUID().UUIDString,
              name: name,
              parentId: parent?.id,
              budgets: nil,
              notes: nil)
  }
}

extension Category: Equatable {
}

func ==(lhs: Category, rhs: Category) -> Bool {
  if lhs.budgets == nil && rhs.budgets != nil {
    return false
  }
  if lhs.budgets != nil && rhs.budgets == nil {
    return false
  }

  var budgetsEqual = false
  if lhs.budgets == nil && rhs.budgets == nil {
    budgetsEqual = true
  } else {
    budgetsEqual = lhs.budgets! == rhs.budgets!
  }

  return (lhs.id == rhs.id &&
          lhs.name == rhs.name &&
          lhs.parentId == rhs.parentId &&
          budgetsEqual &&
          lhs.notes == rhs.notes &&
          lhs.hidden == rhs.hidden)
}
