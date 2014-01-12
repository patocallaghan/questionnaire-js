/* app/ui/map/util */

define(
	[
		'jquery'
	],

	function ( $ ) {

		'use strict';

		return {

			goToUrl: function (region, isCountry) {
				var url = isCountry ? this._getCountryUrl(region) : this._getRegionUrl(region);
				window.open(url, '_self');
			},

			_getRegionUrl: function (region) {
				var $regionSelector = $('.js-region-dropdown');
				var url = $regionSelector.find('#' + region)[0].value;
				return url;
			},

			_getCountryUrl: function (region) {
				var url = $('#js-' + region).attr('href');
				return url;
			}

		};
	}
);