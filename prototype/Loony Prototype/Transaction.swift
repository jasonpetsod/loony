struct TransactionCategory {
  let categoryId: String
  let categoryName: String
  let amountCents: Int

  var amount: Double {
    get {
      return Double(amountCents) / 100
    }
  }
}

struct Transaction {
  let id: String
  let account: Account
  let date: String
  let payee: Payee
  let memo: String?
  let cleared: Bool = false
  let reconciled: Bool = false
  var categories: [TransactionCategory] = []

  var totalAmount: Double {
    get {
      return categories.reduce(0, combine: {$0 + $1.amount})
    }
  }

  var categoryName: String {
    get {
      if categories.count == 0 {
        return "???"
      } else if categories.count == 1 {
        return categories[0].categoryName
      } else {
        return "Multiple Categories"
      }
    }
  }
}
