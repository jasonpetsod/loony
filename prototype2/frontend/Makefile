PROJECT_ROOT = .

NODE_DIR = node_modules
BROWSERIFY = $(NODE_DIR)/browserify/bin/cmd.js
ESLINT = $(NODE_DIR)/eslint/bin/eslint.js
WATCHIFY = $(NODE_DIR)/watchify/bin/cmd.js

YARN_LOCK = yarn.lock

INPUTS := propTypes.js addTransactionRow.jsx loony.jsx
TARGETS := out.js

all: $(TARGETS)

out.js: $(INPUTS)
	$(BROWSERIFY) $(INPUTS) -t babelify -o out.js

watchify:
	$(WATCHIFY) $(INPUTS) -t babelify -o out.js -v

lint:
	$(ESLINT) $(INPUTS)

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
	watchify
