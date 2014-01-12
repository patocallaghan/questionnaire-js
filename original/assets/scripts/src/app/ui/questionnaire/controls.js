/* app/ui/questionnaire/flow */

define(
	[
		'jquery',
		'app/ui/questionnaire/state',
		'app/ui/questionnaire/data',
		'pubsub'
	],

	function ( $, State, Data ) {

		var Controls;
		var $controls;
		var $main;
		var $start;
		var $next;
		var $prev;
		var lastStage;

		return {

			init: function () {
				Controls = this;
				$main = $( '.questionnaire-aside' );
				$controls = $( '#js-questionnaire-controls' );
				$start = $( '.js-start' );
				$next = $controls.find('.js-next');
				$prev = $controls.find( '.js-previous' );
				lastStage = State.getState().lastStage;
				this._initEvents();
				this._initSubscriptions();
			},
			_initEvents: function(){
				$([$start, $next, $prev]).each(function(){
					$(this).on('click', Controls._processClickEvent);
				});
			},
			_initSubscriptions: function(){
				$.subscribe( '/questionnaire/controls/lock', this._processLockEvent );
				$.subscribe( '/questionnaire/controls/unlock', this._processUnlockEvent );
				$.subscribe( '/questionnaire/controls/text', this._changeControlsText );
			},
			_processClickEvent: function( e ){
				e.preventDefault();
				var action;
				var old;
				var $thisButton = $(this).closest( 'a' );
				if( $thisButton.is( '.js-previous' ) || $thisButton.is('.js-next') && $thisButton.is( '.is-unlocked' ) ) {
					if( $thisButton.attr( 'data-current' ) === lastStage ) {
						$.publish( '/questionnaire/data/save' );
						if( Data.getData().CompletedForm ) {
							$.publish( '/questionnaire/submit/form');
						}
					}
					action = $thisButton.is( '.js-next' ) ? 'setNext' : 'setPrevious';
					old = State.getState().current;
					State[action]();
					$.publish('/questionnaire/step/change', [{
						step: Controls._getState().current,
						old: old
					}]);
					$.publish('/questionnaire/menu/unlock', [{
						step: Controls._getState().current
					}]);
					Controls._setupControls();
				}
				console.log($thisButton);
				if ($thisButton.is('.js-start')) {
					$.publish( '/scroll/to', [{
						element: $main,
						threshold: 200
					}] );
				}
			},
			_setupControls: function(){
				var state = Controls._getState();
				Controls._setButtonState();
				if ( state.current < state.progress ) {
					$next.addClass('is-unlocked');
				} else {
					$next.removeClass( 'is-unlocked' );
				}
			},
			_getState: function(){
				// return {
				// 	stages: ['0', '1a', '1b', '2', '3', 'end'],
				// 	current: '1a',
				// 	next: '1a',
				// 	previous:'-1',
				// 	progress: '1a'
				// };
				return State.getState();
			},
			_setButtonState: function(){
				$next.attr('data-current', State.getState().current);
			},
			_processLockEvent: function(){
				$next.removeClass( 'is-unlocked' );
			},
			_processUnlockEvent: function(){
				$next.addClass( 'is-unlocked' );
			},
			_changeControlsText: function( data ){
				var nextText = data.nextText;
				var prevText = data.prevText;
				Controls._changeSingleControlText( 'next', nextText );
				Controls._changeSingleControlText( 'prev', prevText );
			},
			_changeSingleControlText: function( control, text ) {
				var $control = $controls.find('.js-' + control).find( '.js-btn-text' );
				if( text !== $control.text() ) {
					$control.text( text );
				}
			}
		}
	}
);


