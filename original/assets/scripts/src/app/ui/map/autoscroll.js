/* app/ui/map/autoscroll */

define( 
	[
		'jquery'
	],

	function ( $ ) {

		var Autoscroll;

		return {

			init: function () {
				
				Autoscroll = this;

				var region = this._getURLParameter( 'region' );

				if ( region ) {
					var offSet = $('.listing-offices').offset().top;
					$('body, html').animate({ scrollTop: offSet - 250 }, 800);
				}
			},

			_getURLParameter: function ( sParam ) {
				var sPageURL = window.location.search.substring( 1 );
				var sURLVariables = sPageURL.split( '&' );
				for ( var i = 0; i < sURLVariables.length; i++ ) {
					var sParameterName = sURLVariables[i].split( '=' );
					if ( sParameterName[0] == sParam ) {
						return sParameterName[1];
					}
				}
			}

		};

	}
);