var path = require('path'),
	fs = require('fs'),
	underscore = require('underscore'),
	optimist = require('optimist'),
	assert = require('assert'),
	defaults, defaultConfig, mergedOptions,
	optimistOptions = {
		'c': {
			'alias': 'config-file',
			'describe': 'Specify the path to the doccit configuration file'
		},
		'p': {
			'alias': 'search-path',
			'describe': 'Specify a path to a markdown file for processing'
		},
		'h': {
			'alias': 'help',
			'default': false,
			'describe': ' How to use this tool'
		},
		'v': {
			'alias': 'version',
			'default': true,
			'describe': ' Show the version'
		}
	};

function toCamelCase(hyphenatedString) {
	return hyphenatedString.replace(/-([a-z])/g, function (group) {
		return group[1].toUpperCase();
	});
}

function loadDefaults() {
	var pathToDefaults, file;

	pathToDefaults = path.join(__dirname, 'defaults.json');
	// This should only be read once on startup and is essential for
	// the program to continue: hence sync.
	file = fs.readFileSync(pathToDefaults, 'utf-8');

	return JSON.parse(file);
}

function mergeDefaultsIntoOptions(defaults, options) {
	var merged = underscore.extend({}, options),
		defaultKeys = Object.keys(defaults);

	defaultKeys.map(function mergeIntoOptions(def) {
		var matchingOptions, optionNames;

		optionNames = Object.keys(options);
		matchingOptions = optionNames.filter(function findHyphenatedAlias(opt) {
			return options[opt] && toCamelCase(options[opt].alias) === def;
		});

		if (matchingOptions.length === 1);
			merged[matchingOptions[0]]['default'] = defaults[def];
	});

	return merged;
}

// Need to detect presence of config switch first before we parse the options
// as this will affect the defaults
defaults = loadDefaults();
var options = mergeDefaultsIntoOptions(defaults, optimistOptions);

module.exports = optimist.usage('test').options(options).argv;
