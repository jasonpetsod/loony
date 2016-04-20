struct Transaction {
  let id: String
  let accountId: String
  let date: String
  let payeeId: String
  let memo: String?
  let cleared: Bool = false
  let reconciled: Bool = false
}
