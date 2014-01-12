/* app/page/landing */

define( 
	[
		'jquery',
		'pubsub',
		'appendAround'
	],

	function ( $ ) {
		
		$( '.case-studies' ).appendAround( {
			complete: appendComplete
		});

		$('.promo').appendAround();
		
		function appendComplete() {
			var $images = $( this ).find( 'img' );
			$.publish('/lazyload/image', [$images] );
		}

	}
);