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

extension LedgerViewController: NSTableViewDelegate {
  func tableView(tableView: NSTableView,
                 viewForTableColumn tableColumn: NSTableColumn?,
                 row: Int) -> NSView? {
    var identifier = ""
    var value = ""
    let transaction = transactions[row]
    switch tableColumn! {
      case tableView.tableColumns[0]:
          identifier = "AccountCell"
          value = transaction.accountId
      case tableView.tableColumns[1]:
          identifier = "DateCell"
          value = transaction.date
      case tableView.tableColumns[2]:
          identifier = "PayeeCell"
          value = transaction.payeeId
      case tableView.tableColumns[2]:
          identifier = "CategoryCell"
          value = transaction.id
      default:
        identifier = ""
        value = "???"
    }

    if let cell = tableView.makeViewWithIdentifier(identifier, owner: nil) as?
        NSTableCellView {
      cell.textField?.stringValue = value
      return cell
    }
    return nil
  }
}
