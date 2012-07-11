var underscore = require('underscore'),
	options = require('./lib/options'),
	about = require('./lib/about'),
	program;

program = {};
underscore.extend(program, about);

program.options = options;

module.exports = program;
