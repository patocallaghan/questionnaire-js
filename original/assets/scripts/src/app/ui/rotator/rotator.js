/* app/ui/rotator/rotator */

define(
	[
		'jquery',
		'app/ui/video/load',
		'pubsub',
		'brotator',
		'slabtext'
	],

	function ( $, VideoLoad ) {

		var Rotator;
		var $items;
		var $featureRotator = null;
		var $content = null;
		var count = 0;
		var removedFirstClass = false;

		return {

			init: function () {
				Rotator = this;
				$featureRotator = $( '#js-rotator' );
				$content = $featureRotator.find( '.js-rotator-content' );
				$items = $content.find( 'li' );
				if ( $items.length > 1 ) {
					$featureRotator.brotator( {
						content: '.js-rotator-content',
						timeout: 7000,
						easing: 'easeInOutSine',
						hasMenu: true,
						hasButtons: true,
						next: '.js-next',
						previous: '.js-prev',
						animationSpeed: 800,
						lazyloader: true,
						namespace: '/rotator',
						autorotate: true
					} );
				}
				$( window ).on( 'resize', $.throttle( 250, $.proxy( this._setItemPadding, this ) ) );
				this._setItemPadding();
				VideoLoad.cloneRotatorVideos();
				this._initSubscriptions();
				this._initStopVideoEvent();
				if ( $featureRotator.find( '.js-rotator-no-image' ).length ) {
					this._setSlabFont();
				}
			},

			_initSubscriptions: function () {
				$.subscribe( '/video/pauseRotator', $.proxy( this.stopTimer, this ) );
				$.subscribe( '/video/resumeRotator', $.proxy( this.startTimer, this ) );
			},

			_initStopVideoEvent: function () {
				$featureRotator.on( 'click', '.js-next, .js-prev', $.proxy( this._stopVideo, this ) );
			},

			_stopVideo: function () {
				var $video = $content.find( '.is-selected' ).find( 'iframe' );
				if ( $video.length ) {
					$.publish( '/video/stop', [{ videoid: $video.attr( 'data-videoid' )}] );
				}

			},

			_setSlabFont: function () {
				if ( !$( '.wf-active' ).length && count < 16 ) {
					setTimeout( this._setSlabFont, 250 );
					count++;
				} else {
					$featureRotator.find( '.js-rotator-no-image' ).find( 'h2' ).slabText( {
						viewportBreakpoint: 640
					} );
				}
			},

			destroy: function () {
				$featureRotator.brotator( 'destroy' );
				$( window ).off( 'resize', this._setItemPadding );
			},

			startTimer: function () {
				$featureRotator.trigger( 'start.timer.brotator' );
			},

			stopTimer: function () {
				$featureRotator.trigger( 'stop.timer.brotator' );
			},

			_setItemPadding: function () {
				var percentage;
				var width = $content.width();
				var biggestHeight = 0;
				$items.each( function () {
					var height = $( this ).height();
					if ( height > biggestHeight ) {
						biggestHeight = height;
					}
				} );
				percentage = ( biggestHeight / width ) * 100 + '%';

				if ( !removedFirstClass ) {
					$content.find( '.rotator-item-first' ).removeClass( 'rotator-item-first' );
					removedFirstClass = true;
				}

				$content.css( {
					paddingBottom: percentage
				} );
			}
		};
	}
);