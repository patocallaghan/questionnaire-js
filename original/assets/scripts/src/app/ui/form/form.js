/* app/ui/form/form */

define(
	[
		'jquery',
		'easing'
	],
	
	function ( $ ) {
		
		var Form;
		
		return {

			init: function(){
				Form = this;
				this._initFormExpanderEvents();
			},
			
			_initFormExpanderEvents: function () {
				$( '.js-btn-form-expand' ).on( 'click', this._showForm );
			},
			
			_showForm: function ( e ) {
				e.preventDefault();
				var $contour = $('#contour');
				$contour.show();
				$( 'html,body' ).animate( { scrollTop: $contour.position().top }, 500, 'easeInOutExpo' );
			}

		};

	}
);