PROJECT_ROOT = .

NODE_DIR = node_modules
ESLINT = $(NODE_DIR)/eslint/bin/eslint.js
MOCHA = $(NODE_DIR)/mocha/bin/mocha
WEBPACK = $(NODE_DIR)/webpack/bin/webpack.js

YARN_LOCK = yarn.lock

TARGETS := out.js

all: $(TARGETS)

out.js:
	$(WEBPACK)

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
	out.js \
	test \
	watchify
