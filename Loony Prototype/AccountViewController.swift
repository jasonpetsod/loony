import Cocoa

class AccountViewController: NSViewController {
  let model: SQLiteModel

  @IBOutlet weak var nameField: NSTextField!

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

  @IBAction func addAccountClicked(sender: AnyObject) {
    let name = nameField.stringValue
    print("Account name: \(name)")

    let account = Account.newWithName(name)

    // TODO: handle exception.
    try! model.addAccount(account)

    print("Added account with id = \(account.id)")
  }
}
