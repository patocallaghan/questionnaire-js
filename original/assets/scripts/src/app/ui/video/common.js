/* app/ui/video/common */

define(
	[
		'jquery',
		'pubsub'
	],
	
	function ( $ ) {
		
		var VideoCommon;

		return {

			init: function( thisVid ){
				VideoCommon = this;
				
				this._initVideoEvent();
				
				//As there's been a click change the state of video thumb
				this._setVideoThumbState( thisVid );
			},

			_initVideoEvent: function () {
				if(!$('.js-video').data('video.loaded')) {
					$( '.js-video' )
						.data('video.loaded', 'true')
						.on( 'click', this._handleClick );
				}
			},

			_handleClick: function ( e ) {
				e.preventDefault();
				var $thisVideo = $(this);
				VideoCommon._setVideoThumbState( this );
				$.publish('/video/playing', [{ videoid: $thisVideo.attr('data-videoid') }]);
			},
			
			_setVideoThumbState: function( thisVid ) {
				var $thisVideo = $(thisVid);
				
				if( !this._isGallery( $thisVideo ) ) {
					return;
				}

				var videoId = $thisVideo.attr('data-videoid');
				var $thumbs = this._getAllThumbs( $thisVideo );
				this._changeIcon( $thumbs, videoId );
			},
			
			_changeIcon: function ( $thumbs /* jQuery Object */, videoId /* string */ ) {
				$thumbs.each(function() {
					var $thisThumb = $(this);
					var $thisIcon = $thisThumb.find('.js-icon');

					if( $thisThumb.attr('data-videoid') === videoId ) {
						$thisIcon.removeClass('icof-videoplay').addClass('icof-videopause');
						return;
					}

					$thisIcon.removeClass('icof-videopause').addClass('icof-videoplay');
				});
			},
			
			_isGallery: function( $thisVideo /* jQuery Obect */ ){
				return $thisVideo.closest('.js-video-gallery').find('.js-carousel').length;
			},
			
			_getAllThumbs: function( $thisVideo /* jQuery Obect */ ) {
				return $thisVideo.closest('.js-video-gallery').find('.js-video-thumb');
			}
		};

	}
);