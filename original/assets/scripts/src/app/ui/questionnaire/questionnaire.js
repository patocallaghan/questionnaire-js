/* app/ui/questionnaire/questionnaire */

define(
	[
		'jquery',
		'app/ui/questionnaire/menu',
		'app/ui/questionnaire/flow',
		'app/ui/questionnaire/state',
		'app/ui/questionnaire/content/content',
		'app/ui/questionnaire/content/summary',
		'app/ui/questionnaire/content/responsive',
		'app/ui/questionnaire/controls',
		'app/ui/questionnaire/data',
		'app/ui/questionnaire/submit'
	],

	function ( $, Menu, Flow, State, Content, Summary, Responsive, Controls, Data, Submit ) {

		var Questionnaire;

		return {

			init: function () {
				Questionnaire = this;
				$.subscribe('/questionnaire/state/ready', function(){
					Menu.init();
					Flow.init();
					Controls.init();
					Content.init();
					Summary.init();
					Data.init();
					Submit.init();
					Responsive.init();
				});
				State.init();
			}

		};

	}
);

