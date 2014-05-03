NODE ?= node

test:
	@$(NODE) ./node_modules/.bin/mocha \
		--reporter spec \
		--slow 2s \
		--harmony \
		--bail

.PHONY: test