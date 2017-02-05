PROJECT_ROOT = .

NODE_DIR = node_modules
ESLINT = $(NODE_DIR)/eslint/bin/eslint.js
MOCHA = $(NODE_DIR)/mocha/bin/mocha
WEBPACK = $(NODE_DIR)/webpack/bin/webpack.js
WEBPACK_DEV_SERVER = $(NODE_DIR)/webpack-dev-server/bin/webpack-dev-server.js

BUILD_DIR := build

TARGETS := $(BUILD_DIR)/index.html \
	$(BUILD_DIR)/out.js

all: $(TARGETS)

$(BUILD_DIR):
	@mkdir -p $(BUILD_DIR)

$(BUILD_DIR)/index.html: | $(BUILD_DIR)
	cp dist/index.html $@

$(BUILD_DIR)/out.js: $(BUILD_DIR)/index.html
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
	-rmdir $(BUILD_DIR)

.DEFAULT_GOAL := all
.PHONY: \
	all \
	clean \
	deps \
	devserver \
	lint \
	test \
