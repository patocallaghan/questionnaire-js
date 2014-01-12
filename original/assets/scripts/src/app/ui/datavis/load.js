/* app/ui/datavis/load */

define(
	[
		'jquery',
		'util/mediaqueries'
	],

	function ($, MediaQueries) {

		var DatavisLoad;
		var mobileLoaded = false;

		return {

			init: function () {
				DatavisLoad = this;
				this._initMediaQueries();
			},

			_initMediaQueries: function () {
				MediaQueries.register([{
					//Bind Small Nav
					queries: MediaQueries.queries["interactive-map-small"],
					shouldDegrade: true,
					match: function () {
						if (!mobileLoaded) {
							require(['app/ui/datavis/mobile'], function (DatavisMobile) {
								DatavisMobile.init();
							});
							mobileLoaded = true;
						}
					}
				}, {
					//Bind Large Nav
					queries: MediaQueries.queries["interactive-map-large"],
					shouldDegrade: true,
					match: function () {
						if (!$('#js-map-svg').length) {
							require(['app/ui/datavis/map'], function (DatavisMap) {
								DatavisMap.init();
							});
						}
					}
				}]);
			}

		};

	}
);
