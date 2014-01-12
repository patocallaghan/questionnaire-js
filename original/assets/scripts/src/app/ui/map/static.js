/* app/ui/map/static */

define(
	[
		'jquery'
	],

	function ( $ ) {

		'use strict';

		var $mapMarker;

		return {

			init: function () {
				$mapMarker = $( '.js-map-marker' );
				this.initEvents();
			},

			initEvents: function () {
				$('.js-map-marker').on('mouseenter mouseleave', this.toggleMarkerMenu);
				$('.map-marker-link').on('click', function (e) {
					e.preventDefault();
				});
			},

			toggleMarkerMenu: function () {
				var $thisRegion = $( this );
				$thisRegion.find( '.js-map-marker-menu' ).toggleClass( 'is-visible' );
			}

		};

	}
);
