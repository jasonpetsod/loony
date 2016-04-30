import Cocoa

class LedgerViewController: NSViewController {
  let model: SQLiteModel
  var transactions = [Transaction]()

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

    tableView.setDelegate(self)
    tableView.setDataSource(self)
  }
}

extension LedgerViewController: NSTableViewDataSource {
  func numberOfRowsInTableView(tableView: NSTableView) -> Int {
    return transactions.count;
  }
}

extension Transaction {
  func valueForColumn(tableView: NSTableView,
                      tableColumn: NSTableColumn) -> String {
    switch tableColumn {
      case tableView.tableColumns[0]:
          return account.name
      case tableView.tableColumns[1]:
          return displayDate
      case tableView.tableColumns[2]:
          return payee.name
      case tableView.tableColumns[3]:
          return categoryName
      case tableView.tableColumns[4]:
          if totalAmount < 0 {
            return String(totalAmount)
          } else {
            return ""
          }
      case tableView.tableColumns[5]:
          if totalAmount > 0 {
            return String(totalAmount)
          } else {
            return ""
          }
      default:
        return "???"
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
    let identifier = identifierForColumn(
        tableView, tableColumn: tableColumn!)
    let transaction = transactions[row]
    let value = transaction.valueForColumn(
        tableView, tableColumn: tableColumn!)

    if let cell = tableView.makeViewWithIdentifier(identifier, owner: nil) as?
        NSTableCellView {
      if let textField = cell.textField {
        textField.stringValue = value
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
