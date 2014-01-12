/**
*
* @exports util/template
*/
define(
	[
		'templayed'
	],

	function ( templayed ) {

		return {
			compileTemplate: function( template, data ) {
				return templayed(template)(data);
			}
		};

	}
);


