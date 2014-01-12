/* app/ui/questionnaire/menu */

define(
	[
		'jquery',
		'app/ui/questionnaire/state',
		'app/ui/questionnaire/track',
		'pubsub'
	],

	function ( $, State ) {

		var Track;

		return {

			init: function () {
				Track = this;
				$.subscribe( '/questionnaire/track/progress', Track.trackProgress );
				$.subscribe( '/questionnaire/track/page', Track.trackPage );
			},
			trackProgress: function ( data ) {
				if (Track._gaPushIsReady()) {
					var category = "Questionnaire";
					var action = "Progress";
					var label = Track._convertNameToPath(data);
					// console.log( 'Track Event', category, action, label );
					_gaq.push( [
						"_trackEvent",
						category,
						action,
						label
					]);
				} else {
					// console.log( '_gaq.push() not yet available' );
					setTimeout(
						function () {
							Track.trackPage( data );
						},
						500
					);
				}
			},
			trackPage: function ( data ) {
				if ( Track._gaPushIsReady() ) {
					var pagePath = Track._convertNameToPath( data );
					// console.log( 'Track Page View', pagePath );
					_gaq.push([
						"_trackPageview",
						pagePath
					]);
				} else {
					// console.log( '_gaq.push() not yet available' );
					setTimeout(
						function () {
							Track.trackPage( data );
						},
						500
					);
				}
			},
			_gaPushIsReady: function() {
				return typeof _gaq.push === 'function' ? true : false;
			},
			_convertNameToPath: function ( data ) {
				var pathStart = window.location.pathname;
				var step = data.step;
				var name = data.name;
				var path = pathStart + '/' + step + '-' + name;
				path.replace( '//', '/' );
				return path;
			}
		};

	}
);
