import Foundation

class Account {
  var id: String
  var name: String

  // Whether this is a new Payee not yet committed to storage.
  var isNew: Bool

  init(id: String, name: String, isNew: Bool = false) {
    self.id = id
    self.name = name
    self.isNew = isNew
  }

  class func newWithName(name: String) -> Account {
    return Account(id: NSUUID().UUIDString, name: name, isNew: true)
  }
}

extension Account: Equatable {
}

func ==(lhs: Account, rhs: Account) -> Bool {
  return lhs.id == rhs.id && lhs.name == rhs.name
}
