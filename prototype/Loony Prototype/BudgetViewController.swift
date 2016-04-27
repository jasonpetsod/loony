import Cocoa

class BudgetViewController: NSViewController {
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
  
  @IBAction func addCategoryClicked(sender: AnyObject) {
    let name = nameField.stringValue
    let category = Category.new(name,
                                parentId: nil,
                                notes: nil)

    // TODO: handle exception.
    try! model.addCategory(category)

    print("Added category \(name) with ID \(category.id)")
  }
}
