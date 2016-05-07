import Cocoa

class BudgetViewController: NSViewController {
  let model: SQLiteModel

  // MARK: Initializers

  required init?(coder: NSCoder) {
    do {
      model = try SQLiteModel()
    } catch {
      return nil
    }

    super.init(coder: coder)
  }
}
