import Cocoa

class AccountViewController: NSViewController {
  let model: SQLiteModel

  @IBOutlet weak var nameField: NSTextField!

  required init?(coder: NSCoder) {
    do {
      model = try SQLiteModel()
    } catch {
      return nil
    }

    super.init(coder: coder)
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
