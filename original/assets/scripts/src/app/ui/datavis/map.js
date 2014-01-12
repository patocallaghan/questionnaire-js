/**
*
* @exports app/datavis/map
*/
define(
	[
		'jquery',
		'app/ui/tooltip/tooltip',
		'app/ui/datavis/data',
		'app/ui/datavis/infographic/infographic',
		'app/ui/datavis/pane',
		'app/ui/datavis/zoom',
		'app/ui/datavis/info',
		'app/ui/datavis/filter'
	],
	function ($, Tooltip, Data, Infographic, Pane, Zoom, Info, Filter) {

		return {

			init: function () {
				Tooltip.init();
				Data.init();
				Infographic.init();
				Pane.init();
				Zoom.init();
				Filter.init();
				Info.init();
			}

		};

	}
);
