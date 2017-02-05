PROJECT_ROOT = .

NODE_DIR = node_modules
ESLINT = $(NODE_DIR)/eslint/bin/eslint.js
MOCHA = $(NODE_DIR)/mocha/bin/mocha
WEBPACK = $(NODE_DIR)/webpack/bin/webpack.js
WEBPACK_DEV_SERVER = $(NODE_DIR)/webpack-dev-server/bin/webpack-dev-server.js

TARGETS := dist/out.js

all: $(TARGETS)

dist/out.js:
	$(WEBPACK)

devserver:
	$(WEBPACK_DEV_SERVER) --watch -d --progress

lint:
	$(ESLINT) src/*.js src/*.jsx 'test/**'

test:
	$(MOCHA) --compilers jsx:babel-register $(TESTARGS)

node_modules: package.json yarn.lock
	yarn
	@touch $@

deps: node_modules

clean:
	-rm $(TARGETS)

.DEFAULT_GOAL := all
.PHONY: \
	all \
	clean \
	deps \
	devserver \
	lint \
	test \
