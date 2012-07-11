var should = require('chai').should(),
	defaults = require('../lib/defaults');

describe('Default options', function () {

	it('should be', function () {
		defaults.configFile.should.equal('doccitrc');
		defaults.searchPath.length.should.equal(1);
		defaults.searchPath[0].should.equal('./docs');
	});

	// Need to figure out how to unit test the option definitions
	xit('should be merged into program options', function (){
		var options = require('../lib/options');

		console.log(options);
		options.c['default'].should.equal(defaults.configFile);
		options.p.alias.should.equal(defaults.searchPath);
	});

});
