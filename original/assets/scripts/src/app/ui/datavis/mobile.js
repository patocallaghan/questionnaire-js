/**
*
* @exports app/datavis/mobile
*/
define(
	[
		'app/ui/datavis/group'
	],

	function (Group) {

		return {

			init: function () {
				Group.init();
			}
		};
	}
);