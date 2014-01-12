/* app/page/detail */

define( 
	[
		'jquery',
		'app/ui/social/social',
		'app/ui/form/form',
		'tablescroll',
		'printernator'
	],

	function ( $, Social, Form ) {

		var $tables;
		Social.init();
		$( '.js-print' ).printernator();
		$tables = $( '.body-text' ).find( 'table' ).filter( function () {
			return !( $( this ).closest( '.recaptcha' ).length || $( this ).closest( '.datepicker' ).length );
		} );
		$tables.tableScroll();
		if ($('.js-btn-form-expand').length && $('#contour').length) {
			$('.js-btn-form-expand').removeClass('hidden');
			Form.init();
		} else {
			$('.js-btn-form-expand').remove();
		}
		
	}
);