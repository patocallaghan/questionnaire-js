/* app/util/ajax */

define(
	[
		'jquery',
		'pubsub'
	],

	function ( $ ) {

		'use strict';

		return {

			init: function () {
				$.subscribe( '/ajax/get', $.proxy( this._processRequest, this ) );
				$.subscribe( '/ajax/post/json', $.proxy( this._processPostJsonRequest, this ) );
			},

			_processRequest: function ( data ) {
				var callback = this._generateCallback( data.id, data.callback );
				this._getContent( data.url, data.id, callback );
			},

			_processPostJsonRequest: function( data ) {
				this._postContent( data.url, data.data, data.successCallback, data.errorCallback );
			},

			_generateCallback: function ( id, callback ) {
				var module = this;
				if ( !callback ) {
					return function ( response ) {
						module._publishResponseEvent( id, response );
					};
				} else {
					return function ( response ) {
						module._publishResponseEvent( id, response );
						callback( response );
					};
				}

			},

			_getContent: function ( url, id, callback ) {

				$.ajax( {
					url: url,
					success: callback
				} );
			},

			_postContent: function ( url, data, successCallback, errorCallback  ) {

				$.ajax({
					url:url,
					type: 'POST',
					data: JSON.stringify(data),
					dataType: 'json',
					contentType: 'application/json'
				})
				.done( successCallback )
				.fail( errorCallback );

			},

			_publishResponseEvent: function ( id, response ) {

				$.publish( '/ajax/ready/' + id, [{ html: response}] );
			}
		};
	}
);
