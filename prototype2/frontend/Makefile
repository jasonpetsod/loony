PROJECT_ROOT = .

NODE_DIR = node_modules
BROWSERIFY = $(NODE_DIR)/browserify/bin/cmd.js
ESLINT = $(NODE_DIR)/eslint/bin/eslint.js
MOCHA = $(NODE_DIR)/mocha/bin/mocha
WATCHIFY = $(NODE_DIR)/watchify/bin/cmd.js

YARN_LOCK = yarn.lock

BROWSERIFY_OPTIONS = -t babelify --extension .jsx

INPUTS := App.jsx propTypes.js addTransactionRow.jsx TransactionRow.jsx \
	MutableTransactionRow.jsx transactionTable.jsx loony.jsx
TARGETS := out.js

all: $(TARGETS)

# We don't actually need to pass $(INPUTS) to browserify; all that's needed is
# loony.jsx since browserify will automatically resolve imports. We do need
# $(INPUTS) as part of the recipe for make(1) pick up dependency changes
# though and that's kinda annoying.
# TODO: Switch to Webpack which is the future.
out.js: $(INPUTS)
	$(BROWSERIFY) $(INPUTS) $(BROWSERIFY_OPTIONS) -o out.js -d

watchify:
	$(WATCHIFY) $(INPUTS) $(BROWSERIFY_OPTIONS) -o out.js -v -d

lint:
	$(ESLINT) *.js *.jsx 'test/**'

test:
	$(MOCHA) --compilers jsx:babel-register $(TESTARGS)

$(YARN_LOCK): package.json
	yarn
	@touch yarn.lock

deps: $(YARN_LOCK)

clean:
	rm out.js

.DEFAULT_GOAL := all
.PHONY: \
	all \
	clean \
	deps \
	lint \
	test \
	watchify
