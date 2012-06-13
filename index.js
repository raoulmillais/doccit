var program = require('commander'),
	pkg = require('./lib/package');

program
	.version(pkg.version);
