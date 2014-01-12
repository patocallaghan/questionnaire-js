define(
	[
		'jquery',
		'app/ui/questionnaire/questionnaire',
		'util/scroll'
	],

	function ( $, Questionnaire, Scroll ) {

		Questionnaire.init();
		Scroll.init();

	}
);
