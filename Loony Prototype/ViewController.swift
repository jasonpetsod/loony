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
    
    override func viewDidLoad() {
        super.viewDidLoad()

        let account = Account.newWithName("foo account")

        let model = try! SQLiteModel()
        // TODO: handle exception.
        try! model.addAccount(account)
    }
    
    override var representedObject: AnyObject? {
        didSet {
        // Update the view, if already loaded.
        }
    }

}
