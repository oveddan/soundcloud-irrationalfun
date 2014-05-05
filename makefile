NODE ?= node

test:
	@$(NODE) ./node_modules/.bin/mocha \
		--reporter spec \
		--slow 2s \
		--harmony \
		--bail

downloadpi:
	wget http://stuff.mit.edu/afs/sipb/contrib/pi/pi-billion.txt
		
.PHONY: test downloadpi