import Foundation

class Category {
  var id: String
  var name: String
  var parentId: String?
  var notes: String?
  var hidden: Bool

  init(id: String, name: String, parentId: String?, notes: String?,
       hidden: Bool = false) {
    self.id = id
    self.name = name
    self.parentId = parentId
    self.notes = notes
    self.hidden = hidden
  }

  class func new(name: String, parentId: String?, notes: String?) -> Category {
    return Category(id: NSUUID().UUIDString,
                    name: name,
                    parentId: parentId,
                    notes: notes)
  }
}

extension Category: Equatable {
}

func ==(lhs: Category, rhs: Category) -> Bool {
  return (lhs.id == rhs.id &&
          lhs.name == rhs.name &&
          lhs.parentId == rhs.parentId &&
          lhs.notes == rhs.notes &&
          lhs.hidden == rhs.hidden)
}
