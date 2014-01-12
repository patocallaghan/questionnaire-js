/* app/ui/lightbox/single */

define( 
	[
		'jquery',
		'app/ui/lightbox/common',
		'colorbox'
	],

	function ( $, LightboxCommon ) {

		var LightboxSingle;

		return {

			init: function () {
				LightboxSingle = this;
				LightboxCommon.init(true);
				var config = {
					transition: 'none',
					maxWidth: '90%',
					title: LightboxCommon.setTitle,
					onLoad: LightboxCommon.onLoadProcessing,
					onComplete: LightboxCommon.onCompleteProcessing,
					photo: true
				};
				$( '.no-touch .js-lightbox-single' ).find( 'a' ).not( '.figure-caption' ).colorbox( config );
			},

			open: function () {
				$( this ).trigger( 'click' );
			}
		};

	}
);