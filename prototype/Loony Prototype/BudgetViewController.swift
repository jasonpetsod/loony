import Cocoa

class BudgetViewController: NSViewController {
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
