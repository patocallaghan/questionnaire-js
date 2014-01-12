/* app/util/scroll */

define(
	[
		'jquery',
		'easing',
		'pubsub'
	],

	function ( $ ) {

	'use strict';

	var Scroll;

	return {

		init: function(){
			Scroll = this;
			Scroll._initSubscriptions();
		},
		_initSubscriptions: function(){
			$.subscribe( '/scroll/to', this._processScrollEvent );
		},
		_processScrollEvent: function ( data ) {
			var $element = $(data.element);
			Scroll._scrollTo( $element, data.threshold );
		},
		_scrollTo: function( $element, threshold ){
			var elementTopPosition = $element.offset().top;
			var distanceFromTop = threshold ? elementTopPosition - threshold : elementTopPosition;
			$( 'html,body' ).animate( { scrollTop: distanceFromTop }, 500, 'easeInOutExpo' );
		}

	};

} );

