//
//  ViewController.swift
//  Loony Prototype
//
//  Created by Jason Petsod on 4/12/16.
//  Copyright © 2016 Jason Petsod. All rights reserved.
//

import Cocoa
import AppKit

class ViewController: NSViewController {
    let model: SQLiteModel

    @IBOutlet weak var accountNameField: NSTextField!

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
    }
    
    @IBAction func addAccountClicked(sender: AnyObject) {
        print("Account name: \(accountNameField.stringValue)")

        let account = Account.newWithName(accountNameField.stringValue)

        // TODO: handle exception.
        try! model.addAccount(account)

        print("Added account with id = \(account.id)")
    }
    
    override var representedObject: AnyObject? {
        didSet {
        // Update the view, if already loaded.
        }
    }

}
