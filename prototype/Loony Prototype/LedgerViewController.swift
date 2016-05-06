import Cocoa

class LedgerViewController: NSViewController {
  let model: SQLiteModel
  var transactions = [Transaction]()
  var tableRows = 0

  @IBOutlet weak var tableView: NSTableView!

  @IBOutlet weak var newTransactionButton: NSButton!
  @IBOutlet weak var saveTransactionButton: NSButton!
  var transactionBeingEdited = false
  let newTransactionDelegate = NewTransactionDelegate()

  let dateFormatter: NSDateFormatter

  required init?(coder: NSCoder) {
    do {
      model = try SQLiteModel()
    } catch {
      return nil
    }

    dateFormatter = NSDateFormatter()
    dateFormatter.dateStyle = .MediumStyle
    dateFormatter.timeStyle = .NoStyle
    dateFormatter.timeZone = NSTimeZone(forSecondsFromGMT: 0)

    super.init(coder: coder)
  }

  override func viewDidLoad() {
    super.viewDidLoad()

    transactions = try! model.getTransactions()
    tableRows = transactions.count

    tableView.setDelegate(self)
    tableView.setDataSource(self)
  }

  // MARK: Table accessors

  func getTableCellAtRow(row: Int, column: Int) -> NSTableCellView {
    let view = tableView.viewAtColumn(
        column, row: tableView.selectedRow, makeIfNecessary: false)
    return view as! NSTableCellView
  }

  func getStringValueAtRow(row: Int, column: Int) -> String {
    let cell = getTableCellAtRow(row, column: column)
    return cell.textField!.stringValue
  }

  func getAccountAtRow(row: Int) -> Account {
    let accountName = getStringValueAtRow(row, column: 0)
    if let account = model.getAccount(id: nil, name: accountName) {
      return account
    } else {
      return Account.newWithName(accountName)
    }
  }

  func getCategoryAtRow(row: Int) -> Category {
    let name = getStringValueAtRow(row, column: 3)
    if let category = model.getCategory(name: name) {
      print("Found category = \(category); id = \(category.id)")
      return category
    } else {
      return Category.new(name, parentId: nil, notes: nil)
    }
  }

  func getPayeeAtRow(row: Int) -> Payee {
    let payeeName = getStringValueAtRow(row, column: 2)
    if let payee = model.getPayee(id: nil, name: payeeName) {
      return payee
    } else {
      return Payee(id: NSUUID().UUIDString, name: payeeName, isNew: true)
    }
  }

  func parseStringAsCents(s: String) -> Int? {
    // TODO: Do something less stupid.
    let centsString = s.stringByReplacingOccurrencesOfString(
        ".", withString: "")
    guard let cents = Int(centsString) else {
      return nil
    }
    return cents
  }

  // MARK: Create transaction
  
  @IBAction func newTransactionClicked(sender: AnyObject) {
    newTransactionButton.enabled = false
    transactionBeingEdited = true
    tableRows += 1
    let newRow = tableRows - 1
    tableView.reloadData()
    tableView.editColumn(0, row: newRow, withEvent: nil, select: true)
    tableView.selectRowIndexes(NSIndexSet(index: newRow),
                               byExtendingSelection: false)
    saveTransactionButton.enabled = true
  }

  func createTransactionFromRow(row: Int) -> Transaction? {
    // TODO: Validate cells.

    let account = getAccountAtRow(row)
    print("Found account with ID = \(account.id)")

    let payee = getPayeeAtRow(row)
    print("Found payee with ID = \(payee.id); isNew = \(payee.isNew)")

    let dateString = getStringValueAtRow(row, column: 1)
    guard let date = dateFormatter.dateFromString(dateString) else {
      print("Could not parse date: \(dateString)")
      return nil
    }

    let category = getCategoryAtRow(row)
    var amountCents = 0
    if let outflowCents = parseStringAsCents(
        getStringValueAtRow(row, column: 4)) {
      amountCents = -1 * outflowCents
    }
    if let inflowCents = parseStringAsCents(
        getStringValueAtRow(row, column: 5)) {
      // TODO: Don't allow both outflowCents and inflowCents to be specified.
      // TODO: Only allow positive outflowCents and inflowCents.
      amountCents = inflowCents
    }
    let txCategory = TransactionCategory(category: category,
                                         amountCents: amountCents)

    var transaction = Transaction(
        id: NSUUID().UUIDString,
        account: account,
        date: date,
        payee: payee,
        memo: nil,
        categories: [txCategory])

    do {
      try model.transaction {
        if account.isNew {
          print("Adding new account with ID = \(account.id)")
          try self.model.addAccount(account)
        }
        if payee.isNew {
          print("Adding new payee with ID = \(payee.id)")
          try self.model.addPayee(payee)
        }
        try self.model.addTransaction(transaction)
      }
    } catch {
      print("Could not add transaction: \(error)")
      return nil
    }
    transaction.account.isNew = false
    // TODO: Make Payee a class so that SQLiteModel.addPayee can set this.
    transaction.payee.isNew = false

    return transaction
  }

  @IBAction func saveTransactionClicked(sender: AnyObject) {
    saveTransactionButton.enabled = false

    let row = tableView.selectedRow
    // TODO: Stop edits on any text fields open for edit.
    // TODO: Deselect row.
    // TODO: Set text fields to not be editable.

    let cell = getTableCellAtRow(row, column: 0)

    if let transaction = cell.objectValue as? Transaction {
      // TODO: Edit existing transaction.
      print("Edit transation: \(transaction)")
    } else {
      if let transaction = createTransactionFromRow(row) {
        cell.objectValue = transaction as? AnyObject
        transactions.append(transaction)
        tableView.reloadData()
      }
      // TODO: Clear fields' placeholder text.
      // TODO: Handle failure: keep editing new transaction.
    }

    transactionBeingEdited = false
    newTransactionButton.enabled = true
  }
}

extension LedgerViewController: NSTableViewDataSource {
  func numberOfRowsInTableView(tableView: NSTableView) -> Int {
    return tableRows;
  }
}

extension Transaction {
  func columnStringValues() -> [String?] {
    return [
        account.name,
        displayDate,
        payee.name,
        categoryName,
        displayOutflow,
        displayInflow,
    ]
  }
}

class NewTransactionDelegate: NSObject {
}

extension NewTransactionDelegate: NSTextFieldDelegate {
  func control(control: NSControl,
               textShouldEndEditing fieldEditor: NSText) -> Bool {
    guard let cell = control.superview as? NSTableCellView else {
      return false
    }
    guard let row = cell.superview as? NSTableRowView else {
      return false
    }
    guard let _ = row.superview as? NSTableView else {
      return false
    }
    return true
  }
}

extension LedgerViewController: NSTableViewDelegate {
  func tableView(tableView: NSTableView,
                 viewForTableColumn tableColumn: NSTableColumn?,
                 row: Int) -> NSView? {
    guard let columnIdx = tableView.tableColumns.indexOf(tableColumn!) else {
      return nil
    }

    let tableCellIdentifiers = [
        "AccountCell",
        "DateCell",
        "PayeeCell",
        "CategoryCell",
        "OutflowCell",
        "InflowCell",
    ]
    let identifier = tableCellIdentifiers[columnIdx]

    if let cell = tableView.makeViewWithIdentifier(identifier, owner: self) as?
        NSTableCellView {
      if row < transactions.count {
        let transaction = transactions[row]
        cell.objectValue = transaction as? AnyObject

        // TODO: Use NSKeyValueCoding.valueForKey to dynamically get the
        // correct property based on column index.
        let value = transaction.columnStringValues()[columnIdx]
        if let textField = cell.textField {
          if let stringValue = value {
            textField.stringValue = stringValue
          } else {
            textField.stringValue = ""
          }
          textField.editable = true
          textField.delegate = self
        }
      } else {
        if let textField = cell.textField {
          textField.editable = true
          textField.delegate = newTransactionDelegate
          textField.stringValue = ""
          textField.placeholderString = "hello"
        }
      }

      // TODO: Wrap tab order of last element to the first using nextKeyView.

      return cell
    }
    return nil
  }

  func selectionShouldChangeInTableView(tableView: NSTableView) -> Bool {
    return !transactionBeingEdited
  }
}

extension LedgerViewController: NSTextFieldDelegate {
  func control(control: NSControl,
               textShouldEndEditing fieldEditor: NSText) -> Bool {
    print("new contents: \(fieldEditor.string)")
    return true;
  }
}
