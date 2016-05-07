import Foundation

struct TransactionCategory {
  let category: Category
  let amountCents: Int

  var amount: Double {
    get {
      return Double(amountCents) / 100
    }
  }
}

extension TransactionCategory: Equatable {
}

func ==(lhs: TransactionCategory, rhs: TransactionCategory) -> Bool {
  return lhs.category == rhs.category && lhs.amountCents == rhs.amountCents
}

struct Transaction {
  let id: String
  let account: Account
  let date: NSDate
  var payee: Payee
  let memo: String?
  let cleared: Bool = false
  let reconciled: Bool = false
  var categories: [TransactionCategory] = []

  var totalAmount: Double {
    get {
      return categories.reduce(0, combine: {$0 + $1.amount})
    }
  }

  var displayInflow: String? {
    get {
      if totalAmount > 0 {
        return String(totalAmount)
      } else {
        return nil
      }
    }
  }

  var displayOutflow: String? {
    get {
      if totalAmount < 0 {
        return String(totalAmount)
      } else {
        return nil
      }
    }
  }

  var categoryName: String {
    get {
      if categories.count == 0 {
        return "???"
      } else if categories.count == 1 {
        return categories[0].category.name
      } else {
        return "Multiple Categories"
      }
    }
  }

  var displayDate: String {
    get {
      let formatter = NSDateFormatter()
      formatter.dateStyle = .MediumStyle
      formatter.timeStyle = .NoStyle
      return formatter.stringFromDate(date)
    }
  }
}

extension Transaction: Equatable {
}

func ==(lhs: Transaction, rhs: Transaction) -> Bool {
  return (lhs.id == rhs.id &&
          lhs.account == rhs.account &&
          lhs.date == rhs.date &&
          lhs.payee == rhs.payee &&
          lhs.memo == rhs.memo &&
          lhs.cleared == rhs.cleared &&
          lhs.reconciled == rhs.reconciled &&
          lhs.categories == rhs.categories)
}
