// Include and setup all the stuff for testing
define([

	'jquery',
	'chai',
	'sinon-chai',
	'chai-jquery',
	'fixtures'

], function(jQuery, chai, sinonChai, jqueryChai, fixtures) {

    window.$ = window.jQuery = jQuery;
    window.chai         = chai;
    window.expect       = chai.expect;
    window.assert       = chai.assert;
    window.sinonChai    = sinonChai; // Buggy as hell right now
    window.jqueryChai   = jqueryChai;
    window.fixtures     = fixtures;

    chai.use(sinonChai);
    chai.use(jqueryChai);
    fixtures.getFixtures().fixturesPath = 'spec/fixtures';

});

