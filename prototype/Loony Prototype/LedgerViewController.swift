import Cocoa

class LedgerViewController: NSViewController {
  let model: SQLiteModel
  var transactions = [Transaction]()
  var tableRows = 0

  @IBOutlet weak var tableView: NSTableView!

  @IBOutlet weak var newTransactionButton: NSButton!
  @IBOutlet weak var saveTransactionButton: NSButton!
  let newTransactionDelegate = NewTransactionDelegate()

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
    newTransactionButton.enabled = false
    tableRows += 1
    tableView.reloadData()
    tableView.editColumn(0, row: tableRows - 1, withEvent: nil, select: true)
    saveTransactionButton.enabled = true
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
}

extension LedgerViewController: NSTextFieldDelegate {
  func control(_ control: NSControl,
               textShouldEndEditing fieldEditor: NSText) -> Bool {
    print("new contents: \(fieldEditor.string)")
    return true;
  }
}
