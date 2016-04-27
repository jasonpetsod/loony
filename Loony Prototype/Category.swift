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
