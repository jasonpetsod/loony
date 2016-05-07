import Foundation

struct Month {
  let year: Int
  let month: Int

  init(year: Int, month: Int) {
    self.year = year
    self.month = month
  }

  init(date: NSDate) {
    let calendar = NSCalendar.currentCalendar()
    let unitFlags: NSCalendarUnit = [.Month, .Year]
    let components = calendar.components(unitFlags, fromDate: date)
    self.init(year: components.year, month: components.month)
  }
}
