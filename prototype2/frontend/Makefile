PROJECT_ROOT = .

NODE_DIR = node_modules
BROWSERIFY = $(NODE_DIR)/browserify/bin/cmd.js
ESLINT = $(NODE_DIR)/eslint/bin/eslint.js
MOCHA = $(NODE_DIR)/mocha/bin/mocha
WATCHIFY = $(NODE_DIR)/watchify/bin/cmd.js

YARN_LOCK = yarn.lock

BROWSERIFY_OPTIONS = -t babelify --extension .jsx

INPUTS := propTypes.js addTransactionRow.jsx TransactionRow.jsx \
	MutableTransactionRow.jsx transactionTable.jsx loony.jsx
TARGETS := out.js

all: $(TARGETS)

out.js: $(INPUTS)
	# $(INPUTS) isn't actually needed here; all that's needed is loony.jsx since
	# browserify will automatically resolve imports. We do need it to have
	# make(1) pick up dependency changes though and that's kinda annoying.
	# TODO: Switch to Webpack which is the future.
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
