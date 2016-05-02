struct Payee {
  let id: String
  let name: String

  // Whether this is a new Payee not yet committed to storage.
  var isNew = false
}
