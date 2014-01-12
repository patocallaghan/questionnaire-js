/* app/ui/form/placeholder */

define(
	[
		'jquery',
		'placeholdit'
	],

	function( $ ){

		var Placeholder;

		return {
			
			init: function () {
				Placeholder = this;
				$(document).ready(function(){
					Placeholder._initEvents();
					$( '.js-form' ).placeholdIt();
				});
			},
			
			_initEvents: function () {
				var $form = $( '.js-form' );
				$form.on( 'placeholdit.valid', 'input[placeholder], textarea[placeholder]', { action: 'hide' }, this._showHideErrors );
				$form.on( 'placeholdit.invalid', 'input[placeholder], textarea[placeholder]', { action: 'show' }, this._showHideErrors );
			},
			
			_showHideErrors: function ( e ) {
				var action = e.data.action;
				var $thisInput = $( this );
				var $error = $thisInput.next( '.js-error' );
				if ( $thisInput.is( '.input-split-field' ) ) {
					$error = $thisInput.closest( '.input-split' ).next( 'js-error' );
				}
				$error[action]();
			}
			
		};

	}
);