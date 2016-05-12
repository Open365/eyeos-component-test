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

var sinon = require('sinon');
var assert = require('chai').assert;

var ExecuteComponentTest = require('../lib/ExecuteComponentTest');
var CheckAvailability = require('eyeos-check-availability');

suite("ExecuteComponentTest Suite", function () {
    var sut;
    var exec, checkAvailability;

    setup(function () {
		checkAvailability = new CheckAvailability();
		exec = sinon.stub();
        sut = new ExecuteComponentTest(checkAvailability, exec);
    });

	suite('#execute', function () {
		test('should call to exec', function () {
			sut.execute();
			sinon.assert.calledWith(exec, sinon.match.string, sinon.match.object, sinon.match.func);
		});
	});

	suite('#start', function () {
		var clock;

		setup(function () {
			clock = sinon.useFakeTimers();
		});

		teardown(function () {
			clock.restore();
		});

		test('should call execute when checking ok', function() {
			var called = 0;
			sut.execute = function() {
				called++;
			};
			sinon.stub(checkAvailability, 'check', function(list, cb) {
				cb();
			});
			sut.start();
			clock.tick(20001);
			assert.equal(called, 1, 'Not called');
		});
	});
});
