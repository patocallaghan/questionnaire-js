/* app/ui/lightbox/video */

define( 
	[
		'jquery',
		'app/ui/lightbox/common',
		'colorbox'
	],

	function ( $, lightboxCommon ) {

		var LightboxVideo;

		return {
			init: function () {
				LightboxVideo = this;
				var config = {
					transition: 'none',
					iframe: true,
					innerHeight: '70%',
					innerWidth: '90%',
					maxWidth: '90%',
					title: lightboxCommon.setTitle,
					onLoad: lightboxCommon.onLoadProcessing,
					onComplete: lightboxCommon.onCompleteProcessing
				};

				lightboxCommon.init(true);
				$( '.js-lightbox-video' ).find( 'a' ).not( '.figure-caption' ).colorbox( config );
			},
			
			open: function () {
				$( this ).trigger( 'click' );
			}

		};

	}
);