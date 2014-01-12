/* app/util/object */

define(
	[],

	function () {
		return {

			getObjectLength: function ( obj ) {

				var count = 0;

				if ( !obj ) {
					return count;
				}

				for ( var prop in obj ) {
					if ( obj.hasOwnProperty( prop ) ) {
						count++;
					}
				}

				return count;
			}
			
		};
	}
);