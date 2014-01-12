/* app/ui/lightbox/iframe */

define( 
	[
		'jquery',
		'app/ui/lightbox/common',
		'colorbox'
	],

	function ( $, LightboxCommon ) {

		var LightboxIframe;

		return {
			init: function () {
				LightboxIframe = this;
				var config = {
					transition: 'none',
					width: '90%',
					height: '80%',
					maxWidth: '660px',
					onLoad: LightboxIframe._feedbackLoad,
					onComplete: LightboxIframe._feedbackFormFunctions,
					overlayClose: false
				};

				LightboxCommon.init( false );
				var lightboxLink = $( '.js-lightbox-iframe' ).find( 'a' );
				var newHref = lightboxLink.attr( 'href' ) + '&body=true';
				lightboxLink.attr( 'href', newHref ).colorbox( config );
			},

			open: function () {
				$( this ).trigger( 'click' );
			},

			_feedbackLoad: function () {
				LightboxCommon._removeButtons();
				LightboxCommon.onLoadProcessing();

			},

			_feedbackFormFunctions: function () {
				LightboxCommon.onCompleteProcessing( true );
				require( ['app/ui/form/feedback'], function ( Feedback ) {
					Feedback.init();
				} );
			}
		};
	}
);