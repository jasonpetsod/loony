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

  init?(_ coder: NSCoder? = nil) {
    // TODO: Handle exception.
    model = try! SQLiteModel()

    dateFormatter = NSDateFormatter()
    dateFormatter.dateStyle = .MediumStyle
    dateFormatter.timeStyle = .NoStyle
    dateFormatter.timeZone = NSTimeZone(forSecondsFromGMT: 0)

    if coder != nil {
      super.init(coder: coder!)
    } else {
      super.init(nibName: nil, bundle: nil)
    }
  }

  required convenience init?(coder: NSCoder) {
    self.init(coder)
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

  func getAccountAtRow(row: Int) -> Account? {
    let accountName = getStringValueAtRow(row, column: 0)
    do {
      return try model.getAccount(nil, name: accountName)
    } catch {
      return Account.newWithName(accountName)
    }
  }

  func getPayeeAtRow(row: Int) -> Payee? {
    let payeeName = getStringValueAtRow(row, column: 2)
    do {
      return try model.getPayee(id: nil, name: payeeName)
    } catch {
      return Payee(id: NSUUID().UUIDString, name: payeeName, isNew: true)
    }
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

    guard let account = getAccountAtRow(row) else {
      print("Could not get account from row")
      return nil
    }
    print("Found account with ID = \(account.id)")

    guard let payee = getPayeeAtRow(row) else {
      print("Could not get payee from row")
      return nil
    }
    print("Found payee with ID = \(payee.id); isNew = \(payee.isNew)")

    let dateString = getStringValueAtRow(row, column: 1)
    guard let date = dateFormatter.dateFromString(dateString) else {
      print("Could not parse date: \(dateString)")
      return nil
    }

    // XXX NEXT:
    // 2) parse categories correctly
    // 3) store categories in backend

    var transaction = Transaction(
        id: NSUUID().UUIDString,
        account: account,
        date: date,
        payee: payee,
        memo: nil,
        categories: [])  // TODO

    model.transaction {
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
      }
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
    print("new contents of \(control): \(fieldEditor.string)")
    guard let cell = control.superview as? NSTableCellView else {
      return false
    }
    guard let row = cell.superview as? NSTableRowView else {
      return false
    }
    guard let table = row.superview as? NSTableView else {
      return false
    }
    print("Hello from NewTransactionDelegate!")
    return true;
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
