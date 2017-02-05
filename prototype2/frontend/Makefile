PROJECT_ROOT = .

NODE_DIR = node_modules
ESLINT = $(NODE_DIR)/eslint/bin/eslint.js
MOCHA = $(NODE_DIR)/mocha/bin/mocha
WEBPACK = $(NODE_DIR)/webpack/bin/webpack.js
WEBPACK_DEV_SERVER = $(NODE_DIR)/webpack-dev-server/bin/webpack-dev-server.js

YARN_LOCK = yarn.lock

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

$(YARN_LOCK): package.json
	yarn
	@touch yarn.lock

deps: $(YARN_LOCK)

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
