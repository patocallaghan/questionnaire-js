/**
*
* @exports app/datavis/zoom
*/
define(
	[
		'jquery',
		'd3',
		'app/ui/datavis/infographic/regions',
		'app/ui/datavis/data',
		'pubsub'
	],

	function ($, d3, Regions, Data) {

		var ZoomButton;
		var $zoomOutButton;
		var $zoomOutLocation;
		var globalCountryId;

		return {
			init: function () {
				ZoomButton = this;
				$zoomOutButton = $('#js-zoom-out-button');
				$zoomOutLocation = $('#js-zoom-out-location');
				this._initEvents();
				this._initSubscriptions();
			},
			_initEvents: function () {
				$zoomOutButton.on('click', this._processClickEvent);
			},
			_initSubscriptions: function () {
				$.subscribe('/map/button/show', this._showBackButton);
				$.subscribe('/map/button/hide', this._hideBackButton);
				$.subscribe('/map/location/change', this._updateBackButtonText);
				$.subscribe( '/map/data/ready', this._processDataReadyEvent );
			},
			_showBackButton: function () {
				$zoomOutButton.addClass('is-visible').removeClass('is-hidden');
			},
			_hideBackButton: function () {
				$zoomOutButton.addClass('is-hidden').removeClass('is-visible');
			},
			_updateBackButtonText: function (data) {
				var displayText = 'world';

				if (data.isRegion) {
					$zoomOutLocation.attr('data-prev-location', data.location);
					$zoomOutLocation.text(displayText);
					return;
				}
				if (data.isZoom && !data.isRegion) {
					displayText = $zoomOutLocation.attr('data-prev-location');
					$zoomOutLocation.text(displayText);
					return;
				}
			},
			_processDataReadyEvent: function(){
				globalCountryId = Data.getGlobalCountry();
			},
			_processClickEvent: function (event) {
				event.preventDefault();
				var location = '';
				var visibleRegionCountry = d3.selectAll('.js-region-countries.is-visible');
				if ( visibleRegionCountry[0].length > 1 || visibleRegionCountry.attr('id') === globalCountryId) {
					location = Regions.getCurrentRegion().attr('data-region-id');
					location = location.replace('-', ' ');
					$.publish('/map/track/button/backtomain', [{
						location: location
					}]);
					ZoomButton._backToDefaultZoom();
					return;
				}
				location = $(d3.selectAll('.js-region-countries.is-visible')[0]).attr('id');
				$.publish(
					'/map/track/button/backtoregion', [{
						location: location.charAt(0).toUpperCase() + location.slice(1).toLowerCase()
					}]
				);
				ZoomButton._backToRegionZoom();
			},
			_backToDefaultZoom: function () {
				ZoomButton._hideBackButton();
				$.publish('/map/zoom/default');
				$.publish('/map/pane/hide');
				$.publish('/tooltip/hide');
			},
			_backToRegionZoom: function () {
				$.publish('/map/zoom/region');
				$.publish('/tooltip/hide');
			}
		};

	}
);

