define([

	'jquery'

], function($){

	describe('Sample Spec', function() {

		var result = 'sample';

		it("should return the correct output", function() {

			//Setup
			var answer = 'sample';

			//Work

			//Assertion
			expect(answer).to.equal(result);
		});

	});

});

