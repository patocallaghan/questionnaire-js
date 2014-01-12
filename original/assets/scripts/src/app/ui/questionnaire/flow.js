/* app/ui/questionnaire/flow */

define(
	[
		'jquery',
		'app/ui/questionnaire/state',
		'pubsub'
	],

	function ( $, State ) {

		var Flow;
		var $startScreen;
		var $introduction;
		var $status;
		var $main;
		var $stages;
		var $steps;

		return {

			init: function () {
				Flow = this;
				$introduction = $('#js-questionnaire-introduction');
				$startScreen = $('#js-questionnaire-begin');
				$status = $('#js-questionnaire-status');
				$main = $('#js-questionnaire-main');
				$summary = $('#js-questionnaire-end');
				$stages = $main.find('.js-questionnaire-stage');
				$steps = $stages.find('.js-questionnaire-section');
				this._initEvents();
				this._initSubscriptions();
			},
			_initEvents: function(){
				$startScreen.on('click', this._processStartClick);
			},
			_initSubscriptions: function(){
				$.subscribe('/questionnaire/step/change', this._processFlowChangeEvent);
			},
			_processStartClick: function( e ){
				e.preventDefault();
				Flow._toggleStartScreen( 'hide' );
				State.setNext();
				$.publish( '/questionnaire/menu/update', [{
					step: State.getState().current,
					old: '0'
				}] );
				$.publish( '/questionnaire/content/toggle/equalise', [{
					$step: $steps.eq(0)
				}] );
			},
			_processFlowChangeEvent: function( data ){
				var $newStep;
				var isDifferentStage;
				var step = data.step;
				var $currentStep = $summary.is( '.is-visible') ? $summary : $steps.filter( function(){
					return $(this).is('.is-visible');
				} );
				var current = $currentStep.is('#js-questionnaire-end') ? 'end' : $currentStep.attr( 'data-step' );
				if (step === '0') {
					$currentStep.removeClass( 'is-visible' );
					Flow._toggleStartScreen( 'show' );
					return;
				}

				if (step === 'end') {
					$newStep = $summary;
				} else {
					$newStep = $steps.filter( function(){
						return $(this).attr( 'data-step' ) === step;
					} );
				}

				isDifferentStage = (current ==  'end' || step === 'end') ? true : Flow._checkIfStepIsDifferentStage( current, step  );

				$currentStep.removeClass( 'is-visible' );
				$newStep.addClass( 'is-visible' );

				if( isDifferentStage ) {
					$currentStep.closest( '.js-questionnaire-stage' ).removeClass( 'is-visible' );
					$newStep.closest( '.js-questionnaire-stage' ).addClass( 'is-visible' );
				}

				if( step === 'end' ) {
					$main.removeClass( 'is-visible' );
					$.publish( '/questionnaire/summary/render' );
					$.publish('/questionnaire/menu/lock/all');
				}

				if ( current === 'end' ) {
					$main.addClass( 'is-visible' );
				}

				$.publish( '/scroll/to', [{
					element: $main,
					threshold: 100
				}] );

				$.publish( '/questionnaire/content/toggle/equalise', [{
					$step: $newStep
				}] );

				$.publish( '/questionnaire/content/buttons/text', [{
					$step: $newStep
				}] );

			},
			_checkIfStepIsDifferentStage: function(currentStep, newStep) {
				var regex = /^\d+/;
				return regex.exec( currentStep )[0] !== regex.exec( newStep )[0];
			},
			_toggleStartScreen: function( action ){
				startAction = action === 'show' ? 'addClass' : 'removeClass';
				mainAction = action === 'show' ? 'removeClass' : 'addClass';
				$introduction[startAction]('is-visible');
				$startScreen[startAction]('is-visible');
				$status[mainAction]('is-visible');
				$main[mainAction]('is-visible');
				$stages.eq(0)[mainAction]('is-visible');
				$steps.eq(0)[mainAction]('is-visible');
			}

		}
	}
);

