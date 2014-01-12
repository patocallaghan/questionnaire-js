/* app/ui/map/load */

define(
	[
		'jquery',
		'util/mediaqueries',
		'pubsub'
	],

	function ($, MediaQueries) {

		var MapLoad;

		return {

			init: function () {
				MapLoad = this;
				this._initMediaQueries();
			},

			_initMediaQueries: function () {
				MediaQueries.register([{
					//Bind Carousel Medium
					queries: MediaQueries.queries["medium-small"],
					shouldDegrade: true,
					match: function () {

						if (!$('.js-map-container').is('.is-loaded') && Modernizr.svg) {
							$.publish('/loader/show', [{
								element: $('.js-map-container')
							}]);
						}

						if (Modernizr.svg) {
							require(['app/ui/map/svg', 'app/ui/map/autoscroll'], function (SVG, Autoscroll) {
								SVG.init();
								Autoscroll.init();
							});
							return;
						}

						require(['app/ui/map/static'], function (StaticMap) {
							StaticMap.init();
						});

					}
				}]);
			},

			unbind: function () {
			}

		};

	}
);
