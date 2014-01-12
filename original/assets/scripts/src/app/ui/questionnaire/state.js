/* app/ui/questionnaire/state */

define(
	[
		'jquery',
		'app/ui/questionnaire/track',
		'pubsub'
	],

	function ( $, Track ) {

		var State;
		var state = {
			stages: [],
			current: '',
			currentName: 'Start',
			next: '',
			previous: '-1',
			progress: '',
			lastStage: '',
			summary: {}
		};
		var $menu;

		return {

			init: function () {
				State = this;
				$menu = $( '#js-questionnaire-status' );
				this._setupState();
			},
			getState: function(){
				return state;
			},
			setNext: function(){
				this._updateNext();
			},
			setPrevious: function(){
				this._updatePrevious();
			},
			setState: function( step ){
				this._hardcodeState( step );
			},
			_setupState: function(){
				this._setupStages();
				this._setupCurrent();
				this._setupNext();
				this._setupProgress();
				this._setLastStage();
				$.publish('/questionnaire/state/ready', [state]);
			},
			_setupStages: function(){
				var steps = $('.js-questionnaire-step');
				state.stages.push('0');
				steps.each(function(){
					state.stages.push($(this).attr('data-step'));
				});
				state.stages.push('end');
			},
			_setupCurrent: function(){
				state.current = '0';
			},
			_setupNext: function(){
				state.next = state.stages[1];
			},
			_setupProgress: function(){
				state.progress = '0';
			},
			_setLastStage: function(){
				var stages = state.stages;
				var stagesLength = stages.length;
				state.lastStage = stages[stagesLength - 2];
			},
			_updateNext: function(){
				var stages = state.stages;
				var stagesLength = stages.length;
				var newPrevious = state.current;
				var currentIndex = $.inArray( newPrevious, state.stages );
				if(currentIndex < stagesLength - 1) {
					var newCurrent = state.stages[currentIndex + 1];
					var newNext = currentIndex + 2 > stagesLength - 1 ? '-1' : state.stages[currentIndex + 2];
					State._updateState(newCurrent, newNext, newPrevious);
					State._updateProgress();
				}
			},
			_updatePrevious: function(){
				var stages = state.stages;
				var current = state.current;
				var currentIndex = stages.indexOf(current);
				if(currentIndex > 0){
					var newCurrent = stages[currentIndex - 1];
					var newPrevious = currentIndex === 1 ? '-1' : stages[currentIndex - 2];
					State._updateState(newCurrent, current, newPrevious);
				}
			},
			_updateCurrentName: function ( step ) {
				var $name = $menu.find( '[data-step="' + step + '"]' );
				var isStageName = $name.find( '.js-questionnaire-status-name' ).length;
				var name;
				if ( isStageName ) {
					name = $.trim( $name.find( ".js-questionnaire-status-name" ).text() )
				} else {
					name = $.trim( $name.text() );
				}
				return name;
			},
			_hardcodeState: function( step ){
				var stages = state.stages;
				var currentIndex = stages.indexOf(step);
				if( step === '0' ) {
					State._updateState('0', stages[currentIndex + 1], '-1');
					return;
				}
				if( step === 'end' ) {
					State._updateState('end', stages[currentIndex - 1], '-1');
					return;
				}
				State._updateState(step, stages[currentIndex + 1], stages[currentIndex - 1]);
			},
			_updateProgress: function () {
				if(state.current > state.progress || state.current === 'end'){
					state.progress = state.current;
					$.publish( '/questionnaire/track/progress', [{
						step: state.current,
						name: state.currentName
					}] );
				}

			},
			_updateState: function(current, next, previous ){
				state.previous = previous;
				state.current = current;
				state.currentName = State._updateCurrentName( current );
				state.next = next;
				$.publish( '/questionnaire/track/page', [{
					step: state.current,
					name: state.currentName
				}] );
			}

		};

	}
);


