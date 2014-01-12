/* util/mediaqueries */

define(
	[
		'jquery',
		'enquire'
	],

	function ( $ ) {

		'use strict';

		var shouldDegrade;

		return {

			queries: {
				"all": "screen",
				"small": "screen and (max-width: 449px)",
				"medium-small": "screen and (min-width: 640px)",
				"medium": "screen and (min-width: 780px)",
				"medium-large": "screen and (min-width: 900px)",
				"large": "screen and (min-width: 1024px)",
				"extra-large": "screen and (min-width: 1180px)",
				"nav-small": "screen and (max-width: 639px)",
				"nav-large": "screen and (min-width: 640px)",
				"carousel-small": "screen and (max-width: 579px)",
				"carousel-medium": "screen and (min-width: 580px) and (max-width: 1024px)",
				"carousel-large": "screen and (min-width: 1025px)",
				"interactive-map-small": "screen and (max-width: 750px)",
				"interactive-map-large": "screen and (min-width: 751px)"
			},
			
			init: function () {
				//We only want to fire mediaqueries for mediaquery capable browsers. i.e. Not Old IE which gets a fixed view
				shouldDegrade = !$( '.oldie' ).length;
			},
			
			register: function ( config ) {
				if ( Object.prototype.toString.call( config ) === '[object Array]' ) {
					for ( var i = 0; i < config.length; i++ ) {
						var currentConfig = config[i];
						this._addToHandler( currentConfig );
					}
				} else {
					this._addToHandler( config );
				}

			},

			_addToHandler: function ( config ) {
				//Init JS mediaquery handlers using Enquire.JS
				enquire.register( config.queries, {
					match: config.match,
					unmatch: config.unmatch,
					deferSetup: true
				}, config.shouldDegrade ).listen( 250 );
			}

		};
	}
);