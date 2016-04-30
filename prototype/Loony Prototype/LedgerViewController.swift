import Cocoa

class LedgerViewController: NSViewController {
  let model: SQLiteModel
  var transactions = [Transaction]()
  var tableRows = 0
  let newTransactionDelegate = NewTransactionDelegate()

  @IBOutlet weak var tableView: NSTableView!

  init?(_ coder: NSCoder? = nil) {
    // TODO: Handle exception.
    model = try! SQLiteModel()

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
  
  @IBAction func newTransactionClicked(sender: AnyObject) {
    tableRows += 1
    tableView.reloadData()
    tableView.editColumn(0, row: tableRows - 1, withEvent: nil, select: true)

    // TODO: Lock tab ordering.
  }
}

extension LedgerViewController: NSTableViewDataSource {
  func numberOfRowsInTableView(tableView: NSTableView) -> Int {
    return tableRows;
  }
}

extension Transaction {
  func valueForColumn(tableView: NSTableView,
                      tableColumn: NSTableColumn) -> String? {
    let values = [
        account.name,
        displayDate,
        payee.name,
        categoryName,
        displayOutflow,
        displayInflow,
    ]

    if let idx = tableView.tableColumns.indexOf(tableColumn) {
      return values[idx]
    } else {
      return ""
    }
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
                 viewForTableColumn maybeTableColumn: NSTableColumn?,
                 row: Int) -> NSView? {
    guard let tableColumn = maybeTableColumn else {
      return nil
    }
    guard let columnIdx = tableView.tableColumns.indexOf(tableColumn) else {
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

    if let cell = tableView.makeViewWithIdentifier(identifier, owner: nil) as?
        NSTableCellView {
      if row < transactions.count {
        let transaction = transactions[row]
        let value = transaction.valueForColumn(tableView,
                                               tableColumn: tableColumn)
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
      return cell
    }
    return nil
  }
}

extension LedgerViewController: NSTextFieldDelegate {
  func control(_ control: NSControl,
               textShouldEndEditing fieldEditor: NSText) -> Bool {
    print("new contents: \(fieldEditor.string)")
    return true;
  }
}
