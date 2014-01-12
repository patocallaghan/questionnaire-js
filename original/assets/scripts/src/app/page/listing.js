/* app/page/listing */

define( 
	[
		'jquery'
	],

	function ( $ ) {

		'use strict';

		if ( $( '.js-listing-infinite' ).length ) {
			require(['app/ui/infinitescroll/infinitescroll'], function( InfiniteScroll ) {
				InfiniteScroll.init();
			});
		}
		
		if ( $( '.js-map-container' ).length && $( '.svg' ).length || $( '.oldie' ).length ) {
			require(['app/ui/map/load'], function( MapLoad ) {
				MapLoad.init();
			});
		}
		
		if ( $( '.js-expand-collapse' ).length ) {
			require( ['app/ui/expander/expander'], function ( Expander ) {
				Expander.init();
			} );
		}

	}
);