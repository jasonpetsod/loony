import Cocoa

class LedgerViewController: NSViewController {
  let model: SQLiteModel
  var transactions = [Transaction]()
  var tableRows = 0

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

extension LedgerViewController: NSTableViewDelegate {
  func identifierForColumn(tableView: NSTableView,
                           tableColumn: NSTableColumn) -> String {
    let tableCellIdentifiers = [
        "AccountCell",
        "DateCell",
        "PayeeCell",
        "CategoryCell",
        "OutflowCell",
        "InflowCell",
    ]

    if let idx = tableView.tableColumns.indexOf(tableColumn) {
      return tableCellIdentifiers[idx]
    } else {
      return ""
    }
  }

  func tableView(tableView: NSTableView,
                 viewForTableColumn tableColumn: NSTableColumn?,
                 row: Int) -> NSView? {
    let identifier = identifierForColumn(tableView, tableColumn: tableColumn!)

    var value: String?
    if row < transactions.count {
      let transaction = transactions[row]
      value = transaction.valueForColumn(tableView, tableColumn: tableColumn!)
    } else {
      value = ""
    }

    if let cell = tableView.makeViewWithIdentifier(identifier, owner: nil) as?
        NSTableCellView {
      if let textField = cell.textField {
        if let stringValue = value {
          textField.stringValue = stringValue
        } else {
          textField.stringValue = ""
        }
        textField.editable = true
        textField.delegate = self
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
