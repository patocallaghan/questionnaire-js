define( [], function () {

	'use strict';

	return {
		open: function ( url, width, height ) {
			var newwindow = window.open( url, 'name', 'height=' + height + ',width=' + width );
			if ( window.focus ) {
				newwindow.focus();
			}
		}
	};
	
} );