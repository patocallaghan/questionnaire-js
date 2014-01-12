/**
*
* @exports app/datavis/filter
*/
define(
	[
		'jquery',
		'app/ui/expander/expander',
		'pubsub'
	],
	function ( $, Expander ) {
		var Group;
		var classes = {
			group: '.js-nonmap',
			banner: '.js-nonmap-banner',
			region: '.js-nonmap-region',
			country: '.js-nonmap-country',
			backMain: '.js-nonmap-back-main',
			backRegion: '.js-nonmap-back-region',
			marketResearch: '.js-nonmap-market-link',
			newsFeature: '.js-nonmap-news-link',
			collapsed: '.is-collapsed',
			expanded: '.is-expanded'
		};
		var state = {
			collapsed: 'collapsed',
			expanded: 'expanded'
		};

		return {
			init: function () {
				Group = this;
				Group._initWatches();
				if( window.location.search.indexOf( 'region' ) > -1 ){
					Expander.init();
				}
			},

			_initWatches: function () {
				Group._watchRegionList();
				Group._watchCountryList();
				Group._watchBackMain();
			},

			_getLocationDataAttribute: function ( $elm ) {
				return $elm.attr( 'data-location' );
			},

			_getExpandCollapseState: function ( $expander ) {
				return $expander.hasClass( classes.collapsed.replace( '.', '' ) ) ? state.collapsed : state.expanded;
			},

			_getState: function ( $location ) {
				return $location.data( 'state' );
			},

			_setState: function ( $location ) {
				if ( $location.hasClass( classes.collapsed.replace( '.', '' ) ) ) {
					$location.data( 'state', state.collapsed );
				} else {
					$location.data( 'state', state.expanded );
				}
			},

			_toggleState: function ( $location ) {
				if ( $location.data( 'state' ) === state.collapsed ) {
					$location.data( 'state', state.expanded );
				} else {
					$location.data( 'state', state.collapsed );
				}
			},

			_watchRegionList: function () {
				var $regionList = $( classes.region );
				for ( var i = 0; i < $regionList.length; i++ ) {
					var $region = $regionList.eq( i );
					var data = {};
					data.location = Group._getLocationDataAttribute( $region );

					$region.on( 'click', classes.banner, function ( event ) {
						if( $(this).closest('.js-nonmap-region').is( '.is-disabled' ) ){
							return false;
						}
						$.publish( '/map/track/region/show', [data] );
					} );
				}
			},

			_watchCountryList: function () {
				var $countryList = $( classes.country );
				for ( var i = 0; i < $countryList.length; i++ ) {
					var $country = $countryList.eq( i );
					var data = {
						location: Group._getLocationDataAttribute( $country )
					};

					Group._setState( $country );
					Group._watchCountry( $country, data );
					Group._watchMarket( $country, data );
					Group._watchNews( $country, data );
				}
			},

			_watchCountry: function ( $location, data ) {
				$location.on( 'click', classes.banner, function () {
					if ( Group._getState( $location ) === state.collapsed ) {
						$.publish( '/map/track/country/show', [data] );
					}
					Group._toggleState( $location );
				} );
			},

			_watchNews: function ( $location, data ) {
				$location.on( 'click', classes.newsFeature, function ( event ) {
					var $link = $( this );
					data.name = $link.text();
					data.url = $link.attr( 'href' );
					$.publish( '/map/track/news/link', [data] );
				} );

			},

			_watchMarket: function ( $location, data ) {
				$location.on( 'click', classes.marketResearch, function ( event ) {
					var $link = $( this );
					data.name = $link.text();
					data.url = $link.attr( 'href' );
					$.publish( '/map/track/market/link', [data] );
				} );
			},

			_watchBackMain: function () {
				var $back = $( classes.backMain );
				var data = {
					location: Group._getLocationDataAttribute( $back )
				};
				$back.on( 'click', function () {
					$.publish( '/map/track/button/backtomain', [data] );
				} );
			}
		};
	}
);
