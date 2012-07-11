var should = require('chai').should();

describe('about', function () {

	it('should only name, author and version', function () {
		var about = require('../lib/about');

		should.exist(about.name);
		should.exist(about.author);
		should.exist(about.version);
		should.not.exist(about.scripts);
	});

});
