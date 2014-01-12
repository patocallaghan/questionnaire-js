define( {

	JSON: [
		{

			isAvailable: function () {
				// Let's provide a test that indicates
				// if this implementation is available.
				// This is our most desired impl for
				// this feature, so we put it first.

				return typeof JSON != 'undefined';
			},

			module: function () {
				return JSON;
			}
		},
		{

			isAvailable: function () {
				// This implementation is kind of a
				// fallback impl, that is always
				// available, but it should only be
				// used if the others are not available.
				return true;
			},

			implementation: 'JSON'
		}
	],

	matchMedia: [
		{
			isAvailable: function () {
				// test if native matchMedia is available
				return typeof matchMedia != 'undefined';
			},

			// if so, directly use the matchMedia object as module
			module: function () {
				return matchMedia;
			}
		},
		{
			isAvailable: function () {
				// This is the fallback
				return  document.documentElement.className.indexOf( 'oldie' ) === -1;
			},

			// return the path to some matchMedia implementation
			implementation: 'matchMedia'
		},
		{
			isAvailable: function () {
				// This is the fallback
				return document.documentElement.className.indexOf( 'oldie' ) > -1;
			},

			// return the path to some matchMedia implementation
			implementation: 'matchMediaIE8'
		}
	],

	getComputedStyle: [
		{
			isAvailable: function () {
				// test if native getComputedStyle is available
				return typeof getComputedStyle != 'undefined';
			},

			// if so, directly use the getComputedStyle object as module
			module: function () {
				return getComputedStyle;
			}
		},
		{
			isAvailable: function () {
				// This is the fallback
				return true;
			},

			// return the path to some getComputedStyle implementation
			implementation: 'getComputedStyle'
		}
	]
} );
