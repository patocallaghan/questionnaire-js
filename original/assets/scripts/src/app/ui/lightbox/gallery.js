/* app/ui/lightbox/gallery */

define( 
	[
		'jquery',
		'app/ui/lightbox/common',
		'colorbox',
	],

	function ( $, LightboxCommon ) {

		var LightboxGallery;

		return {

			init: function () {

				LightboxGallery = this;

				var config = {
					transition: 'none',
					current: 'Image {current} of {total}',
					maxWidth: '90%',
					photo: true,
					rel: this.rel,
					title: LightboxCommon.setTitle,
					onLoad: LightboxCommon.onLoadProcessing,
					onComplete: LightboxCommon.onCompleteProcessing
				};
				
				if ( $( '.no-touch body.mobile' ).length ) {
					$( '.js-lightbox-gallery' ).not( '.js-gallery-flickr' ).find( 'a' ).not( '.figure-caption' ).colorbox( config );
					$( '.js-gallery-flickr' ).on( 'click', this.openFlickrSeparately );
					return;
				}
				$( '.no-touch .js-lightbox-gallery' ).find( 'a' ).colorbox( config );
			},

			openFlickrSeparately: function ( e ) {
				e.preventDefault();
				var $thisFlickrGallery = $( this );
				var flickrUrl = $thisFlickrGallery.attr( 'data-seturl' );
				window.open( flickrUrl, '_blank' );
			},

			open: function () {
				$( this ).trigger( 'click' );
			}
		};

	}
);