/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var sys = require('sys');
var format = require('util').format;
var exec = require('child_process').exec;
var CheckAvailability = require('eyeos-check-availability');
var settings = require('./settings');
var SPACE = ' ';

function ExecuteComponentTests(checkAvailability, fakeExec) {
	this.checkAvailability = checkAvailability || new CheckAvailability();
	this.exec = fakeExec || exec;
	this.command = 'node_modules/mocha/bin/_mocha -u tdd -R spec %s component-test/';
}

ExecuteComponentTests.prototype.execute = function (envars, extraParams) {
    var command = format(this.command, extraParams);
    console.log('Executing component tests. Env:', envars);
    console.log('>>', command);

	this.exec(command, {env: envars}, function puts(error, stdout, stderr) {
		sys.puts(stdout);
		if (error) {
			sys.puts(stderr);
			process.exit(1);
		}
	});
};

ExecuteComponentTests.prototype.processEnvars = function () {
    return process.env;
};

ExecuteComponentTests.prototype.processParams = function () {
	var extraArgvParams = process.argv;
	var extraParams = SPACE;
	for(var key = 0;key < extraArgvParams.length; key+=2) {
		var paramName = extraArgvParams[key];
		if (paramName.indexOf('--') === 0) {
			var paramValue = extraArgvParams[key+1];
		}
		if (paramName === '--timeout') {
			process.env.TIMEOUT = paramValue;
			process.env.BUS_EXPECTATION_TIMEOUT = +paramValue * 0.9;
			process.env.EYEOS_HIPPIE_TIMEOUT = paramValue;
			extraParams += paramName + SPACE + paramValue + SPACE;
		} else if (paramName === '--command') {
			this.command = paramValue;
		}
	}
	this.dependencyList = settings.checkArray;
	return extraParams;
};

ExecuteComponentTests.prototype.start = function () {
    var extraParams = this.processParams();
    var envars = this.processEnvars();
	var self = this;
	this.checkAvailability.check(this.dependencyList, function(err) {
		if (err) {
			console.error('Max retries reached, pipeline failed!');
			process.exit(1);
		} else {
			console.log('Executing component test');
			self.execute.call(self, envars, extraParams);
		}
	}, settings.retryTime, settings.timeout);
};

module.exports = ExecuteComponentTests;
