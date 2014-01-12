/* app/ui/questionnaire/submit */

define(
	[
		'jquery',
		'app/ui/questionnaire/state',
		'app/ui/questionnaire/data',
		'util/ajax',
		'pubsub'
	],

	function ( $, State, Data, Ajax ) {

		var Submit;

		return {

			init: function () {
				Submit = this;
				this._initSubscriptions();
				Ajax.init();
			},
			_initSubscriptions: function(){
				$.subscribe( '/questionnaire/submit/form', this._processFormAndSummary );
			},
			_processFormAndSummary: function() {
				var data = Data.getData();
				console.log( 'form data', data );
				/* jshint ignore:start */
				// $.publish( '/ajax/post/json', [{
				// 	url: '/submit/exportquestionnaire',
				// 	data: data,
				// 	successCallback: function( response ){
				// 		$.publish( '/questionnaire/submit/form/confirmation', [{
				// 			data: data,
				// 			success: true
				// 		}] );
				// 		console.log( 'submitted questionnaire', response );
				// 	},
				// 	errorCallback: function( response ) {
				// 		$.publish( '/questionnaire/submit/form/confirmation', [{
				// 			data: data,
				// 			success: false
				// 		}] );
				// 		console.log( 'error submitting questionnaire', response );
				// 	}
				// }] );
				/* jshint ignore:end */

			},
			_processEmailRequest: function(){

			}
		};

	}
);


