out.js: loony.js
	node_modules/browserify/bin/cmd.js loony.js -t babelify -o out.js

.PHONY: watchify
watchify:
	node_modules/watchify/bin/cmd.js loony.js -t babelify -o out.js -v

.PHONY: clean
clean:
	rm out.js
