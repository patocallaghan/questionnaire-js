/* app/ui/infinitescroll/button */

define( 
	[
		'jquery',
		'pubsub'
	],

	function ( $ ) {

		var Button;
		var $button;
		var hasMore = true;

		return {

			init: function () {
				Button = this;
				$button = $( '.js-listing-infinite-btn' );
				this._initEvents();
				this._initSubscriptions();
			},

			_initEvents: function () {
				$button.on( 'click', { proxy: this }, this._processClick );
			},

			_initSubscriptions: function () {
				$.subscribe( '/pagination/url', $.proxy( this._showMore, this ) );
				$.subscribe( '/listing/complete', $.proxy( this._showButton, this ) );
			},

			_processClick: function ( event ) {
				event.preventDefault();
				event.data.proxy._publishNextEvent();
				event.data.proxy._hideButton();
				$( '.js-pagination-end' ).text( $( '.js-listing-infinite li' ).length );
			},

			_publishMoreEvent: function ( url ) {
				$.publish( '/listing/more', [{
					url: url
				}] );
			},

			_publishNextEvent: function () {
				$.publish( '/pagination/next' );
			},

			_showMore: function ( data ) {
				if ( data.url === -1 ) {
					return;
				}
				hasMore = data.hasMore;
				this._publishMoreEvent( data.url );
			},

			_hideButton: function () {
				var data = {
					element: $button
				};
				$button.css( 'visibility', 'hidden' );
				$.publish( '/loader/show', [data] );
			},

			_showButton: function () {
				$.publish( '/loader/hide' );
				if ( !hasMore ) {
					return;
				}
				$button.css( 'visibility', 'visible' );
			}

		};

	}
);