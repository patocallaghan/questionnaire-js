/* app/ui/lightbox/mobile */

define(
	[
		'jquery',
		'hammer'
	],

	function ( $ ) {

		var lightboxHtml = '<div id="mobile-carousel-wrap" style="display: none;">' +
							'<div id="mobile-carousel">' +
								'<div class="swipe-instruct">' +
									'<img src="/images/interface/lightbox/mobile/touch-instruct.201304141200.png" /> ' +
									'<h3 class="uppercase heading">swipe to view more</h3>' +
								'</div>' +
								'<div id="close-carosel"></div>' +
								'<ul class="slides"></ul>' +
							'</div>' +
							'<ul class="controls">' +
								'<li class="scroll-left"></li>' +
								'<li class="scroll-right"></li>' +
							'</ul>' +
						'</div>';
		
		$( 'body' ).append( lightboxHtml );

		var gallerySelector = $( '.js-lightbox-gallery' ).find( 'a' ).first().attr( 'rel' );

		$( "a[rel='" + gallerySelector + "']" ).on( 'click', function ( ev ) {
			ev.preventDefault();
			var carousel = new Carousel( "#mobile-carousel", gallerySelector, "gallery" );
			$( "#mobile-carousel-wrap" ).show();
			carousel.init();
		} );

		$( '.js-lightbox-single a' ).on( 'click', function ( ev ) {
			ev.preventDefault();
			var carousel = new Carousel( "#mobile-carousel", $( this ), "image" );
			$( "#mobile-carousel-wrap" ).show();
			carousel.init();
		} );

		$( "#close-carosel" ).on( 'click', function ( ev ) {
			ev.preventDefault();
			$( "#mobile-carousel-wrap" ).hide();
			$( "#mobile-carousel" ).find( '.slides' ).empty()
			.removeAttr( 'style' )
			.removeClass( 'animate' );
		} );


		function Carousel( element, reference, type ) {
			var self = this;
			element = $( element );
			var imageUrl = "";
			var imageDetails = "";
			var generatedPane = "";
			if ( type == "gallery" ) {
				var index = 1;
				$( '.controls' ).show();
				$( '.swipe-instruct' ).show();
				$( ".js-lightbox-gallery" ).find( "a[rel='" + reference + "']" ).each( 
			function () {
				var currentItem = $( this );
				imageUrl = currentItem.attr( 'href' );
				imageDetails = currentItem.find( 'img' ).attr( 'alt' ) ? currentItem.find( 'img' ).attr( 'alt' ) : "";
				generatedPane = "<li class='pane" + index + "'><div class='image-wrap'><img src='" +
					imageUrl +
					"' alt='test'/></div>" +
						"<div class='detail'><h3>" + imageDetails + "</h3></div></li>";
				$( '#mobile-carousel' ).find( '.slides' ).append( generatedPane );
				index++;
			} );
			}
			if ( type == "image" ) {
				$( '.controls' ).hide();
				$( '.swipe-instruct' ).hide();
				imageUrl = reference.attr( 'href' );
				imageDetails = reference.find( 'img' ).attr( 'alt' ) ? reference.find( 'img' ).attr( 'alt' ) : "";
				generatedPane = "<li><div class='image-wrap'><img src='" +
				imageUrl +
				"' alt='test'/></div>" +
					"<div class='detail'><h2>" + imageDetails + "</h2></div></li>";
				$( '#mobile-carousel' ).find( '.slides' ).append( generatedPane );
			}
			var container = $( ">ul", element );
			var panes = $( ">ul>li", element );

			var pane_width = 0;
			var pane_count = panes.length;

			var current_pane = 0;


			/**
			* initial
			*/
			this.init = function () {
				setPaneDimensions();

				$( window ).on( "load resize orientationchange", function () {
					setPaneDimensions();
					//updateOffset();
				} )
			};


			/**
			* set the pane dimensions and scale the container
			*/
			function setPaneDimensions() {
				pane_width = element.width();
				panes.each( function () {
					$( this ).width( pane_width );
				} );
				container.width( pane_width * pane_count );
			};


			/**
			* show pane by index
			* @param   {Number}    index
			*/
			this.showPane = function ( index ) {
				// between the bounds
				index = Math.max( 0, Math.min( index, pane_count - 1 ) );
				current_pane = index;

				var offset = -( ( 100 / pane_count ) * current_pane );
				setContainerOffset( offset, true );
			};


			function setContainerOffset( percent, animate ) {
				container.removeClass( "animate" );

				if ( animate ) {
					container.addClass( "animate" );
				}

				if ( Modernizr.csstransforms3d ) {
					container.css( "transform", "translate3d(" + percent + "%,0,0) scale3d(1,1,1)" );
				}
				else if ( Modernizr.csstransforms ) {
					container.css( "transform", "translate(" + percent + "%,0)" );
				}
				else {
					var px = ( ( pane_width * pane_count ) / 100 ) * percent;
					container.css( "left", px + "px" );
				}
			}

			this.next = function () { return this.showPane( current_pane + 1, true ); };
			this.prev = function () { return this.showPane( current_pane - 1, true ); };

			function handleHammer( ev ) {
				// disable browser scrolling
				ev.gesture.preventDefault();

				switch ( ev.type ) {
					case 'dragright':
					case 'dragleft':
						// stick to the finger
						var pane_offset = -( 100 / pane_count ) * current_pane;
						var drag_offset = ( ( 100 / pane_width ) * ev.gesture.deltaX ) / pane_count;

						// slow down at the first and last pane
						if ( ( current_pane == 0 && ev.gesture.direction == Hammer.DIRECTION_RIGHT ) ||
							( current_pane == pane_count - 1 && ev.gesture.direction == Hammer.DIRECTION_LEFT ) ) {
							drag_offset *= .4;
						}

						setContainerOffset( drag_offset + pane_offset );
						break;

					case 'swipeleft':
						self.next();
						ev.gesture.stopDetect();
						$( '.swipe-instruct' ).fadeOut( 800 );
						break;

					case 'swiperight':
						self.prev();
						ev.gesture.stopDetect();
						break;

					case 'release':
						// more then 50% moved, navigate
						if ( Math.abs( ev.gesture.deltaX ) > pane_width / 2 ) {
							if ( ev.gesture.direction == 'right' ) {
								self.prev();
							} else {
								self.next();
							}
						}
						else {
							self.showPane( current_pane, true );
						}
						break;
				}
			}
			element.hammer( { drag_lock_to_axis: true } ).on( "release dragleft dragright swipeleft swiperight", handleHammer );

			//scroll left control
			$( '.scroll-left' ).on( 'click', function () {
				self.prev();
				$( '.swipe-instruct' ).fadeOut( 800 );
			} );
			//scroll right control
			$( '.scroll-right' ).on( 'click', function () {
				self.next();
				$( '.swipe-instruct' ).fadeOut( 800 );
			} );
		}
	}
);