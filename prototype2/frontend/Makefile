PROJECT_ROOT = .

NODE_DIR = node_modules
BROWSERIFY = $(NODE_DIR)/browserify/bin/cmd.js
WATCHIFY = $(NODE_DIR)/watchify/bin/cmd.js

YARN_LOCK = yarn.lock

INPUTS := propTypes.js loony.jsx
TARGETS := out.js

all: $(TARGETS)

out.js: $(INPUTS)
	$(BROWSERIFY) $(INPUTS) -t babelify -o out.js

watchify:
	$(WATCHIFY) $(INPUTS) -t babelify -o out.js -v

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
	watchify
