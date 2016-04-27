import Foundation

class Account {
  var id: String
  var name: String

  init(id: String, name: String) {
    self.id = id
    self.name = name
  }

  class func newWithName(name: String) -> Account {
    return Account(id: NSUUID().UUIDString, name: name)
  }
}
