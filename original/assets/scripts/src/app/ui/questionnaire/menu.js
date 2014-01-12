/* app/ui/questionnaire/menu */

define(
	[
		'jquery',
		'app/ui/questionnaire/state',
		'pubsub'
	],

	function ( $, State ) {

		var Menu;
		var $menu;
		var $steps;

		return {

			init: function () {
				Menu = this;
				$menu = $('#js-questionnaire-status');
				$steps = $menu.find('.js-menu-step');
				this._initEvents();
				this._initSubscriptions();
			},
			_initEvents: function(){
				$menu.on('click', '.js-menu-step, .has-child-steps', this._processStepClick);
			},
			_initSubscriptions: function(){
				$.subscribe('/questionnaire/menu/unlock', this._processStepUnlocked);
				$.subscribe('/questionnaire/menu/update', this._updateMenu);
				$.subscribe('/questionnaire/step/change', this._updateMenu );
				$.subscribe('/questionnaire/menu/lock/all', this._lockMenu );
			},
			_processStepClick: function( e ){
				e.preventDefault();
				var $clickedItem = $(this);
				var state = State.getState();
				var clickedStep = $clickedItem.attr('data-step');
				var oldStep = $menu.find('.js-menu-step.is-current').attr( 'data-step' );
				var currentProgress = state.progress;

				if($clickedItem.is('.has-child-steps') && $clickedItem.is( 'is-current' ) || $clickedItem.is( '.has-child-steps' ) && $clickedItem.find('.is-current').length || $clickedItem.closest( '.js-questionnaire-status-stage' ).is( '.is-locked' ) ) {
					return;
				}

				if($clickedItem.is('.has-child-steps')){
					$clickedItem.addClass( 'is-current' );
					$clickedItem = $clickedItem.find( '.js-menu-step' ).first();
					clickedStep = $clickedItem.attr( 'data-step' );
				}

				if(state.current !== currentProgress && clickedStep <= currentProgress ) {
					$menu.find('.js-menu-step.is-current').removeClass( 'is-current' ).addClass('is-completed');
					$clickedItem.addClass( 'is-current' );
				}
				if(clickedStep <= currentProgress) {
					$.publish('/questionnaire/step/change', [{
						step: clickedStep,
						old: oldStep
					}]);
				}

				State.setState( clickedStep );
				$.publish('/questionnaire/flow/changed');
			},
			_updateMenu: function( data ){
				var newStep = data.step;
				var oldStep = data.old;
				var $newStep = $menu.find('[data-step="'+ newStep + '"]');
				var $oldStep = $menu.find('[data-step="'+ oldStep + '"]');
				var isDifferentStage = (oldStep === 'end' || newStep === 'end' || newStep === '0' || oldStep === '0') ? true : Menu._checkIfStepIsDifferentStage( oldStep, newStep );

				if( $oldStep.length ) {
					$oldStep.removeClass( 'is-current' ).addClass('is-completed');
				}
				$newStep.addClass( 'is-current' );

				if( isDifferentStage ) {
					if( $oldStep.length ) {
						$oldStep.parents( 'li' ).removeClass( 'is-current' ).addClass( 'is-completed' );
					}
					$newStep.parents( 'li' ).addClass( 'is-current' );
				}
			},
			_processStepUnlocked: function( data ){
				var step = data.step;
				var $step = $steps.filter(function(){
					return $(this).attr('data-step') === step;
				});
				$step.addClass( 'is-completed' );
			},
			_checkIfStepIsDifferentStage: function(oldStep, newStep) {
				var regex = /^\d+/;
				return regex.exec( oldStep )[0] !== regex.exec( newStep )[0];
			},
			_lockMenu: function(){
				$steps.closest('.js-questionnaire-status-stage').removeClass( 'is-completed' ).addClass( 'is-locked' );
			}
		};

	}
);
