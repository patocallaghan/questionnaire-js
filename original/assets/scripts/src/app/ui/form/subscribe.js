 /* app/ui/form/subscribe */

define( 
	[
		'jquery'
	],

	function ( $ ) {

		var Subscribe;
		var $subscribeForm;
		var $subscribeInput;
		var $subscribeNameInputs;

		return {

			init: function () {
				Subscribe = this;
				$subscribeForm = $( '.js-form' );
				$subscribeInput = $( '.js-subscribe-email' );
				$subscribeNameInputs = $( '#js-subscribe-name' );
				$subscribeInput.on( 'focus', $.proxy( this._showBlock, this ) );
				this._initEvents();
			},

			_initEvents: function () {
				$( '.js-form' ).find( '.js-submit' ).on( 'click', this._processSubmit );
			},

			_showBlock: function () {
				if ( $subscribeNameInputs.is( '.is-hidden' ) ) {
					$subscribeNameInputs.removeClass( 'is-hidden' ).addClass( ' is-visible' );
				}
			},

			_processSubmit: function ( event ) {
				if ( Subscribe._checkIfValid() ) {
					return;
				}
				event.preventDefault();
				Subscribe._showBlock();
			},

			_checkIfValid: function () {
				var isValid = true;
				$subscribeForm.find( '[required]' ).each( function () {
					var $thisInput = $( this );
					if ( this.value === '' ||
						( $thisInput.attr( 'pattern' ) && !( new RegExp( $subscribeInput.attr( 'pattern' ) ).test( $subscribeInput[0].value ) ) ) ) {
						Subscribe._showHideError( $thisInput );
						isValid = false;
					}
				} );
				return isValid;
			},

			_showHideError: function ( $input, action ) {
				var hiddenClassAction = 'remove';
				var visibleClassAction = 'add';
				var $error = $input.next( '.js-error' ).length ? $input.next( '.js-error' ) : $input.closest( '.js-input-container' ).next( '.js-error' );

				if ( action === 'hide' ) {
					hiddenClassAction = 'remove';
					visibleClassAction = 'add';
				}

				$error[hiddenClassAction + 'Class']( 'is-hidden' )[visibleClassAction + 'Class']( 'is-visible' );
			}
		};

	}
);