struct Payee {
  let id: String
  let name: String

  // Whether this is a new Payee not yet committed to storage.
  var isNew = false
}

extension Payee: Equatable {
}

func ==(lhs: Payee, rhs: Payee) -> Bool {
  return lhs.id == rhs.id && lhs.name == rhs.name
}
