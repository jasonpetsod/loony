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
    let timeZone = NSTimeZone(forSecondsFromGMT: 0)
    let components = calendar.componentsInTimeZone(timeZone, fromDate: date)
    self.init(year: components.year, month: components.month)
  }

  init(timeIntervalSince1970: NSTimeInterval) {
    self.init(date: NSDate(timeIntervalSince1970: timeIntervalSince1970))
  }

  var timeIntervalSince1970: NSTimeInterval {
    let components = NSDateComponents()
    components.year = year
    components.month = month
    components.day = 1
    components.hour = 0
    components.minute = 0
    components.second = 0
    components.calendar = NSCalendar.currentCalendar()
    components.timeZone = NSTimeZone(forSecondsFromGMT: 0)

    return components.date!.timeIntervalSince1970
  }
}

// MARK: Equatable

extension Month: Equatable {
}

func ==(lhs: Month, rhs: Month) -> Bool {
  return lhs.year == rhs.year && lhs.month == rhs.month
}

// MARK: Hashable

extension Month: Hashable {
  var hashValue: Int {
    return "year=\(year) month=\(month)".hashValue
  }
}
