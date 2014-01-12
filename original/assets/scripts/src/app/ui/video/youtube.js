/* app/ui/video/youtube */
//YouTube iframe player API docs https://developers.google.com/youtube/iframe_api_reference

define( 
	[
		'jquery',
		'pubsub'
	],

	function ( $ ) {

		var YouTube;

		//Global YouTube API function. Called after the API has downloaded
		window.onYouTubeIframeAPIReady = function () {
			var $pane = $( '.js-video-pane-ready' );
			var $video = $( '.js-video-youtube-play' );
			YouTube.loadVideo( $pane, $video );
		};

		return {

			init: function ( elem ) {
				YouTube = this;

				var $pane;
				var $video;
				var $thisElem = $( elem );

				this._prepVideo( $thisElem );

				if ( typeof YT != 'undefined' && typeof YT.Player != 'undefined' ) {
					$pane = $( '.js-video-pane-ready' );
					$video = $( '.js-video-youtube-play' );
					this.loadVideo( $pane, $video );
				} else {
					this._loadAPI();
					this._initSubscriptions();
				}
			},

			loadVideo: function ( $pane /* jQuery object */, $video /* jQuery object */ ) {

				var player = null;
				var playerId = $pane.attr( 'id' );
				var videoId = $video.attr( 'data-videoid' );
				var height = $pane.attr( 'data-height' ) ? $pane.attr( 'data-height' ) : $pane.height();
				var width = $pane.attr( 'data-width' ) ? $pane.attr( 'data-width' ) : $pane.height();
				var playOnLoad = $video.attr( 'data-play-on-load' ) === 'true' ? 1 : 0;

				player = new YT.Player( playerId, {
					height: height,
					width: width,
					videoId: videoId,
					events: {
						"onReady": YouTube.readyToPlay
					},
					playerVars: {
						autoplay: playOnLoad,
						rel: 0,
						autohide: 1,
						wmode: "transparent"
					}
				} );

				$pane.data( 'video.youtube', player );
				$.publish( '/video/pauseRotator', [{ playerId: playerId}] );
				this._cleanupVideo();
				this._unsetPlayerToLoad( $( '.js-youtube-player-load' ) );


				player.addEventListener(  
					'onStateChange', 
					function ( event ) {
						if ( event.data === 1 ) {
							$( document ).trigger( {
									"type": '/video/play',
									"videoId": videoId
							} );
						}
					},
					false
				);
			},

			_initSubscriptions: function () {
				$.subscribe( '/video/playing', this._handlePlayingEvent );
				$.subscribe( '/video/stop', this._stopVideoEvent );
			},

			_handlePlayingEvent: function ( data /*Publish Event object*/ ) {
				var videoid = data.videoid;
				$( '.js-video-pane' ).each( function () {
					var player;
					var $thisVideo = $( this );
					if ( $thisVideo !== videoid ) {
						player = $thisVideo.data( 'video.youtube' );
						if ( player ) {
							YouTube.stopVideo( player );
						}

					}
				} );
			},

			_stopVideoEvent: function ( data /*Publish Event object*/ ) {
				var videoid = data.videoid;
				$( '#js-rotator' ).each( function () {
					$( this ).find( '.js-video-pane' ).each( function () {
						var $thisPane = $( this );
						if ( $thisPane.attr( 'data-videoid' ) === videoid ) {
							YouTube._resetVideo( $thisPane, null, true );
							$.publish( '/video/resumeRotator', [{ videoPane: $thisPane}] );
						}
					} );
				} );
			},

			_resetVideo: function ( $currentPane /* jQuery object */, $newVideo /* jQuery object */, isRotator /* Boolean */ ) {

				var $newPane;
				var description;
				if ( !isRotator ) {
					var elem = $currentPane[0];
					var newElem = $newVideo[0];
					$newPane = $( '<a>', {
						'class': elem.className,
						'id': elem.id,
						'href': newElem.href,
						'data-videoid': $newVideo.attr( 'data-videoid' ),
						'data-play-on-load': $newVideo.attr( 'data-play-on-load' ),
						'data-height': elem.height,
						'data-width': elem.width
					} );
					description = $newVideo.attr( 'data-description' );
				} else {
					$newPane = $currentPane.closest( 'li' ).data( 'video.clone' );
				}

				$newPane.insertAfter( $currentPane );
				if ( !isRotator ) {
					$newPane.closest( '.js-video-container' ).find( '.js-video-description' ).html( description );
				}
				$currentPane.remove();
			},

			_loadAPI: function () {
				// This code loads the IFrame Player API code asynchronously.
				var tag = document.createElement( 'script' );
				var firstScriptTag = document.getElementsByTagName( 'script' )[0];
				tag.src = "http://www.youtube.com/player_api";
				firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );
			},

			_prepVideo: function ( $elem /* jQuery object */ ) {
				var $pane = this._findPane( $elem );

				if ( $pane.is( 'iframe' ) ) {
					this._resetVideo( $pane, $elem );
					$pane = this._findPane( $elem );
				}

				$elem.addClass( 'js-video-youtube-play' );
				$pane.addClass( 'js-video-pane-ready' );
			},

			_cleanupVideo: function () {
				$( '.js-video-youtube-play' ).removeClass( 'js-video-youtube-play' );
				$( '.js-video-pane-ready' ).removeClass( 'js-video-pane-ready' );
			},

			_findPane: function ( $elem /* jQuery object */ ) {

				if ( $elem.is( '.js-video-pane' ) ) {
					return $elem;
				}

				return $elem.closest( '.js-video-gallery' ).find( '.js-video-pane' );
			},


			_setPlayerToLoad: function ( $target /* jQuery object */ ) {
				$target.addClass( 'js-youtube-player-load' );
			},

			_unsetPlayerToLoad: function ( $target /* jQuery object */ ) {
				$target.removeClass( 'js-youtube-player-load' );
			},

			readyToPlay: function ( event ) {

			},

			stopVideo: function ( player /* YouTube player object */ ) {
				player.stopVideo();
			}
		};

	}
);