define( 
	[
		'jquery',
		'util/mediaqueries',
		'pubsub',
		'scrollitup'
	],
	
	/**
		* Carousel module. This carousel uses the jquery.scrollItUp plugin to create a list of scrollable thumbnails.
		* @module app/ui/carousel/carousel
		* @example The YouTube video playlist
		* @requires module:jquery
		* @requires module:util/mediqueries
		* @requires module:pubsub
		* @requires module:scrollitup
	*/
	function ( $, MediaQueries ) {

		var $carousels;
		var Carousel;
		var responsiveConfigSmall = {
			itemWidth: 170,
			margin: 20,
			itemsPerView: 2
		};
		var responsiveConfigMedium = {
			itemWidth: 320,
			margin: 20,
			itemsPerView: 3
		};
		var responsiveConfigLarge = {
			itemWidth: 245,
			margin: 20,
			itemsPerView: 4
		};
		
		/** 
		* @constructor
		* @alias module:app/ui/carousel/carousel
		*/
		return {
			
			/** Initialise the carousel. Sets up the mediaqueries, variables and subscribes to published events */
			init: function () {
				Carousel = this;
				$carousels = $( '.js-carousel' );
				this.initMediaQueries();
				this._initSubscriptions();
			},

			runCarouselSetup: function ( responsiveConfig ) {

				$carousels.each( function () {
					var $thisCarousel = $( this );
					var $plugin = $thisCarousel.data( 'plugin_scrollItUp' );

					if ( !$plugin ) {
						Carousel.initCarousel( responsiveConfig );
						return false;
					}

					Carousel.updateCarousel( responsiveConfig );

					return false;
				} );
			},

			initCarousel: function ( responsiveConfig ) {
				var $images;
				$carousels.each( function () {
					var $carousel = $( this );
					if ( $carousel.find( '.js-carousel-item' ).length ) {
						$carousel.scrollItUp( {
							next: '.js-next',
							previous: '.js-prev',
							itemsWrapper: '.js-carousel-content',
							items: '.js-carousel-item',
							viewport: '.js-carousel-viewport',
							lazyLoad: true,
							responsiveConfig: responsiveConfig
						} );
						$images = $carousel.find( '.js-carousel-item:lt(' + responsiveConfig.itemsPerView + ')' ).find( 'img' );
						$.publish( '/lazyload/image', [$images] );
					}
				} );
			},

			_initSubscriptions: function () {
				$.subscribe( '/carousel/setup', $.proxy( this._determineCarousel, this ) );
			},

			_determineCarousel: function () {
				var responsiveConfig = responsiveConfigLarge;
				var width = $( window ).width();
				if ( width < 600 ) {
					responsiveConfig = responsiveConfigSmall;
				} else if ( width > 600 && width < 1025 ) {
					responsiveConfig = responsiveConfigMedium;
				}
				this.initCarousel( responsiveConfig );
			},

			updateCarousel: function ( responsiveConfig ) {
				$carousels.each( function () {
					var $thisCarousel = $( this );
					var $plugin = $thisCarousel.data( 'plugin_scrollItUp' );

					$thisCarousel.trigger( {
						type: 'scrollitup.update',
						responsiveConfig: responsiveConfig,
						proxy: $plugin
					} );

					return false;
				} );
			},

			initMediaQueries: function () {
				MediaQueries.register( [{

					//Bind Carousel Medium
					queries: MediaQueries.queries["carousel-small"],
					shouldDegrade: false,
					match: function () {
						Carousel.runCarouselSetup( responsiveConfigSmall );
					}
				}, {

					//Bind Carousel Medium
					queries: MediaQueries.queries["carousel-medium"],
					shouldDegrade: true,
					match: function () {
						Carousel.runCarouselSetup( responsiveConfigMedium );
					}
				}, {
					//Bind Carousel Large
					queries: MediaQueries.queries["carousel-large"],
					shouldDegrade: false,
					match: function () {
						Carousel.runCarouselSetup( responsiveConfigLarge );
					}
				}] );
			}

		};

	}
);
