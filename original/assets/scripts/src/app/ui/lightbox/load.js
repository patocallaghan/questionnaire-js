/* app/ui/lightbox/load */

define( 
	[
		'jquery'
	],

	function ( $ ) {

		'use strict';

		var LightboxCommon;
		var LightboxSingle;
		var LightboxVideo;
		var LightboxGallery;
		var LightboxIframe;
		var LightboxLoad;

		return {

			init: function () {
				LightboxLoad = this;
				var $lightbox = $( '.js-lightbox-load' );
				if ( $lightbox.length ) {
					$lightbox.find( '.js-lightbox-trigger' ).on( 'click', LightboxLoad._loadAssets );
					$lightbox.find( '.figure-caption' ).on( 'click', LightboxLoad._triggerMainImage );
				}
			},

			_loadAssets: function ( e ) {

				e.preventDefault();

				var $thisImage = $( this );
				//Only run this the first time
				require( 
					[
						'app/ui/lightbox/common',
						'app/ui/lightbox/single',
						'app/ui/lightbox/video',
						'app/ui/lightbox/gallery',
						'app/ui/lightbox/iframe'
					],
					function ( Common, Single, Video, Gallery, Iframe ) {
						LightboxCommon = Common;
						LightboxSingle = Single;
						LightboxVideo = Video;
						LightboxGallery = Gallery;
						LightboxIframe = Iframe;
						LightboxLoad._loadCompleted.call( $thisImage[0] );
					} );
			},

			_triggerMainImage: function ( e ) {
				e.preventDefault();
				$( this ).prevAll( '.js-lightbox-trigger' ).trigger( 'click' );
			},

			_initAllLightboxes: function () {
				if ( $( '.js-lightbox-single' ).length ) {
					LightboxSingle.init();
				}
				if ( $( '.js-lightbox-video' ).length ) {
					LightboxVideo.init();
				}
				if ( $( '.js-lightbox-gallery' ).length ) {
					LightboxCommon.init( true );
					LightboxGallery.init();
				}
				if ( $( '.js-lightbox-iframe' ).length ) {
					LightboxIframe.init();
				}
			},

			_loadCompleted: function () {

				var $thisImage = $( this );
				var $thisParent = $thisImage.closest( 'div' );
				var lightboxType = LightboxSingle;

				LightboxLoad._removeLoadEvents();
				LightboxLoad._initAllLightboxes();

				if ( $thisParent.is( '.js-lightbox-video' ) ) {
					lightboxType = LightboxVideo;
				} else if ( $thisParent.is( '.js-lightbox-gallery' ) ) {
					lightboxType = LightboxGallery;
				} else if ( $thisParent.is( '.js-lightbox-iframe' ) ) {
					lightboxType = LightboxIframe;
				}
				lightboxType.open.call( $thisImage[0] );
			},

			_removeLoadEvents: function () {
				$( '.js-lightbox-load' ).removeClass( 'js-lightbox-load' )
				.find( '.js-lightbox-trigger' )
					.off( 'click', LightboxLoad._loadAssets );
			}
		};

	}
);