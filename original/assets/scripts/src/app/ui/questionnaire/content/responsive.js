/* app/ui/questionnaire/content/responsive */

define(
	[
		'jquery',
		'util/mediaqueries',
		'feature!matchMedia',
		'pubsub'
	],

	function ( $, MediaQueries, matchMedia ) {

		var Responsive;
		var $main;
		var $stages;
		var $steps;

		return {

			init: function () {
				Responsive = this;
				$main = $('#js-questionnaire-main');
				$stages = $main.find('.js-questionnaire-stage');
				$steps = $stages.find('.js-questionnaire-section');
				this._initSubscriptions();
				this._initMediaqueries();
			},
			_initSubscriptions: function(){
				$.subscribe( '/questionnaire/responsive/toggle', this._processToggleEvent );
				$.subscribe( '/questionnaire/responsive/forceToggle', this._forceToggleEvent );
			},
			_initMediaqueries: function() {
				MediaQueries.register( [{
					//Bind Small Screen
					queries: MediaQueries.queries["medium-large"],
					shouldDegrade: true,
					match: Responsive._moveContent,
					unmatch: Responsive._moveContent
				}]);
			},
			_processToggleEvent: function( data ) {
				var $thisStep = data.$thisStep;
				if( Responsive._isLargeView() ) {
					Responsive._moveContentSmallToLarge( $thisStep );
					return true;
				}
				Responsive._moveContentLargeToSmall( $thisStep );
			},
			_forceToggleEvent: function( data ) {
				var $thisStep = data.$thisStep;
				Responsive._moveContentLargeToSmall( $thisStep );
			},
			_moveContent: function(){
				
				$steps.each( function(){
					var $thisStep = $(this);
					if( !Responsive._isOptionSelected( $thisStep ) ) {
						return false;
					}
					if( Responsive._isLargeView() ) {
						Responsive._moveContentSmallToLarge( $thisStep );
						return true;
					}
					Responsive._moveContentLargeToSmall( $thisStep );
				} );

			},
			_isOptionSelected: function( $thisStep ) {
				var $toggleContainer = $thisStep.find( '.questionnaire-toggle' );
				var $toggleList = $toggleContainer.find( '.js-questionnaire-question-list' );
				return $toggleList.find( '.js-input-toggle.is-selected' ).length;
			},
			_moveContentLargeToSmall: function( $thisStep ){

				var $toggleContainer = $thisStep.find( '.questionnaire-toggle' );
				var $answerContainer = $toggleContainer.find( '.js-questionnaire-toggle-answer' );
				var $selectedContent = $answerContainer.find( '.questionnaire-content-inner' );
				var $toggleContainer = $thisStep.find( '.questionnaire-toggle' );
				var $toggleList = $toggleContainer.find( '.js-questionnaire-question-list' );
				var $selectedOption = $toggleList.find( '.js-input-toggle.is-selected' );
				var $toggleContent = $selectedOption.nextAll( '.js-questionnaire-toggle-content' );

				if( !$toggleContent.find( '.questionnaire-content-inner' ).length ) {
					$toggleContent.empty().append( $selectedContent );
				}

			},
			_moveContentSmallToLarge: function( $thisStep ){

				var $toggleContainer = $thisStep.find( '.questionnaire-toggle' );
				var $toggleList = $toggleContainer.find( '.js-questionnaire-question-list' );
				var $selectedOption = $toggleList.find( '.js-input-toggle.is-selected' );
				var $toggleContent = $selectedOption.nextAll( '.js-questionnaire-toggle-content' ).find('.questionnaire-content-inner');
				var $answerContainer = $toggleContainer.find( '.js-questionnaire-toggle-answer' );

				$answerContainer.empty().append( $toggleContent );

			},
			_isLargeView: function(){
				return matchMedia(MediaQueries.queries['medium-large']).matches;
			}
		}

	}
);


