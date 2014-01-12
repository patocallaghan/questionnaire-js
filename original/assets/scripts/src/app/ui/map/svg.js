/* app/ui/map/svg */

define(
	[
		'jquery',
		'raphael',
		'app/ui/map/data',
		'app/ui/map/util',
		'util/detector',
		'pubsub'
	],

	function ($, Raphael, MapData, MapUtil, Detector) {

		'use strict';

		var SVG;

		return {
			nzte: {},
			markers: [],
			exports: {},
			countryText: {},
			sets: {},
			continentSets: {},
			text: {},
			raphael: null,
			_$container: null,
			_isExportsMap: false,

			init: function () {
				SVG = this;
				this._$container = $('.js-map-container');
				this._isExportsMap = $('#js-map-nzte').length ? false : true;

				//If already setup just show the map again
				if (this._$container.is('.is-loaded')) {
					this._$container.show();
					return;
				}

				if (this._isExportsMap) {
					this._initInteractiveMap();
					return;
				}

				this._initRegularMap();
			},

			_initInteractiveMap: function () {
				this._setUpMap();
				this._drawMap();
				this._createContinentSets();
				this._initInteractiveMapEvents();
				this._setLoaded();
				this._hideLoader();
			},

			_initRegularMap: function () {
				this._setUpMap();
				this._drawMap();
				this._createSets();
				this._initRegularMapEvents();
				this._setLoaded();
				this._hideLoader();
			},

			_setLoaded: function () {
				this._$container.addClass('is-loaded');
			},

			_hideLoader: function () {
				$.publish('/loader/hide');
			},

			_setUpMap: function () {
				var id = this._isExportsMap ? 'js-map-exports' : 'js-map-nzte';
				this._$container.show();
				this.raphael = Raphael(id, '100%', '100%');
				this.raphael.setViewBox(0, 0, 841, 407, true);
				this.raphael.canvas.setAttribute('preserveAspectRatio', 'xMinYMin meet');
			},

			_drawMap: function () {
				this._addMainMap();
				this._addContinentMarkers();
				this._addContinentMarkerText();
				if (this._isExportsMap) {
					this._addCountryMarkers();
				}
			},

			_addMainMap: function () {
				var mainAttr = {
					stroke: 'none',
					fill: '#dededd',
					'fill-rule': 'evenodd',
					'stroke-linejoin': 'round'
				};
				this.nzte.main = this.raphael.path(MapData.main).attr(mainAttr);
			},

			_addContinentMarkers: function () {

				var markerAttr = {
					stroke: 'none',
					fill: '#f79432',
					'stroke-linejoin': 'round',
					cursor: 'pointer'
				};
				var markerPaths = MapData.markers[0];
				for (var continent in markerPaths) {
					if (!this._isExportsMap || this._isExportsMap && continent !== 'new-zealand') {
						this.markers[continent] = this.raphael.path(markerPaths[continent]).attr(markerAttr);
					}
				}
			},

			_addContinentMarkerText: function () {

				var textAttr = {
					stroke: 'none',
					fill: '#ffffff',
					'fill-rule': 'evenodd',
					'stroke-linejoin': 'round',
					cursor: 'pointer'
				};
				var textPaths = MapData.text[0];
				for (var continent in textPaths) {
					if (!this._isExportsMap || this._isExportsMap && continent !== 'new-zealand') {
						this.text[continent] = this.raphael.path(textPaths[continent]).attr(textAttr);
					}
				}

			},

			_addCountryMarkers: function () {
				var marker;
				for (var region in this.markers) {
					marker = this.markers[region];
					this._createHoverBox(region, marker);
				}
			},

			_createHoverBox: function (region, marker) {

				var set;
				var markerAttr = {
					stroke: 'none',
					fill: '#116697',
					opacity: 0,
					'stroke-linejoin': 'round'
				};

				var markerPaths = MapData.exportsText[0];
				var country = markerPaths[region];
				if (!country) {
					return;
				}
				var countryText = markerPaths[region][0];
				var numberOfCountries = Object.keys(countryText).length;
				var markerBox = marker.getBBox();
				var topX = markerBox.x;
				var bottomY = markerBox.y2;
				var width = region !== 'india-middle-east-and-africa' ? 150 : 200;

				//Add the rectangle
				this.exports[region] = this.raphael.rect(topX + 28, bottomY - 1, width, (21 * numberOfCountries) + 5).toBack().attr(markerAttr);

				//Create a set to combine countries, hover box and region icon/text
				set = this.raphael.set();
				set.push(
					this.exports[region]
				);

				//Add the country Text
				this._addCountryText(markerBox, countryText, topX + 28, bottomY - 1, 21, region, set);

			},

			_addCountryText: function (markerBox, countryText, x, y, height, region, set) {

				var updatedX = x + 10;
				var updatedY = y + 10;
				var textAttr = {
					font: '13px Arial',
					textAlign: 'left',
					fill: "#ffffff",
					cursor: 'pointer',
					'text-decoration': 'underline',
					'text-anchor': 'start',
					opacity: 0
				};

				for (var country in countryText) {
					var text = countryText[country].toUpperCase();
					this.countryText[country] = this.raphael.text(updatedX, updatedY, text).toBack().attr(textAttr);
					updatedY += height;
					set.push(
						this.countryText[country]
					);
				}

				this.continentSets[region] = set.hide();

			},

			_createSets: function () {

				for (var region in this.markers) {

					var set = this.raphael.set();
					set.push(
						this.markers[region],
						this.text[region]
					);
					this.sets[region] = set;

				}
			},

			_createContinentSets: function () {

				for (var region in this.markers) {

					var set = this.raphael.set();
					set.push(
						this.markers[region],
						this.text[region],
						this.continentSets[region]
					);
					this.sets[region] = set;

				}
			},

			_initInteractiveMapEvents: function () {
				this._initCountryTextEvents();
				this._initCountryHoverEvents();
			},

			_initRegularMapEvents: function () {
				var bounceEasing = 'cubic-bezier(0.680, -0.550, 0.265, 1.550)';
				var mouseOverMarkerBounce = {
					transform: 's1.1'
				};
				var mouseOverMarkerBounceWithTranslate = {
					transform: 's1.1t5,0'
				};
				var mouseOutMarkerBounce = {
					transform: 's1'
				};
				var mouseOverMarker = {
					fill: '#116697'
				};
				var mouseOutMarker = {
					fill: '#f79432'
				};

				for (var region in this.sets) {

					var set = this.sets[region];
					var marker = this.markers[region];
					var text = this.text[region];

					(function (savedSet, savedRegion, savedMarker, savedText) {
						savedSet.attr({
							cursor: 'pointer'
						});
						savedSet.hover(function () {
							//A slight translation is needed for 'india-middle-east-and-africa' so when hovered it isn't clipped by container
							var transformAttr = savedRegion !== 'india-middle-east-and-africa' ? mouseOverMarkerBounce : mouseOverMarkerBounceWithTranslate;
							savedMarker.animate(transformAttr, 250, bounceEasing);
							savedMarker.animate(mouseOverMarker, 250, 'easeInOutExpo');
							savedText.animate(transformAttr, 250, bounceEasing);
						}, function () {
							savedMarker.animate(mouseOutMarkerBounce, 250, bounceEasing);
							savedMarker.animate(mouseOutMarker, 250, 'easeInOutSine');
							savedText.animate(mouseOutMarkerBounce, 250, bounceEasing);
						});
						savedSet.click(function () {
							MapUtil.goToUrl(savedRegion, false);
						});
					})(set, region, marker, text);
				}
			},

			_initCountryHoverEvents: function () {
				var noHover = Detector.noSvgHover();
				var mouseOverMarker = {
					fill: '#116697'
				};
				var mouseOutMarker = {
					fill: '#f79432'
				};

				for (var region in this.sets) {

					var set = this.sets[region];
					var continentSet = this.continentSets[region];
					var marker = this.markers[region];
					var text = this.text[region];
					var hoverBox = this.exports[region];

					(function (savedSet, savedContinentSet, savedRegion, savedMarker, savedText, savedBox) {
						savedSet.attr({
							cursor: 'pointer'
						});
						if (noHover) {
							savedMarker.data('open', false);
							savedSet.click(function () {
								if (savedMarker.data('open') === false) {
									SVG._closeAllContinents();
									savedMarker.data('open', true);
									savedMarker.animate(mouseOverMarker, 250, 'easeInOutExpo');
									savedContinentSet.show().toFront().animate({ opacity: 1 }, 250, 'easeInOutExpo');
								} else {
									savedMarker.data('open', false);
									savedMarker.animate(mouseOutMarker, 250, 'easeInOutSine');
									savedContinentSet.animate({ opacity: 0 }, 250, 'easeInOutSine').hide().toBack();
								}
							});
							savedSet.hover(function () {
								savedMarker.animate(mouseOverMarker, 250, 'easeInOutExpo');
							}, function () {
								savedMarker.data('open') === false && savedMarker.animate(mouseOutMarker, 250, 'easeInOutSine');
							});
						} else {
							savedSet.hover(function () {
								savedMarker.animate(mouseOverMarker, 250, 'easeInOutExpo');
								savedContinentSet.show().toFront().animate({ opacity: 1 }, 250, 'easeInOutExpo');
							}, function () {
								savedMarker.animate(mouseOutMarker, 250, 'easeInOutSine');
								savedContinentSet.animate({ opacity: 0 }, 250, 'easeInOutSine').hide().toBack();
							});
						}
					})(set, continentSet, region, marker, text, hoverBox);
				}
			},

			_closeAllContinents: function () {
				for (var region in this.sets) {
					var continentSet = this.continentSets[region];
					var marker = this.markers[region];
					var mouseOutMarker = {
						fill: '#f79432'
					};
					marker.data('open', false);
					marker.animate(mouseOutMarker, 250, 'easeInOutSine');
					continentSet.animate({ opacity: 0 }, 250, 'easeInOutSine').hide().toBack();
				}
			},

			_initCountryTextEvents: function () {

				for (var country in this.countryText) {

					var text = this.countryText[country];

					(function (savedText, savedCountry) {

						savedText.click(function () {
							MapUtil.goToUrl(savedCountry, true);
						});

						savedText.hover(function () {
							savedText.animate({ 'fill-opacity': 0.6 }, 250, 'easeInOutSine');
						}, function () {
							savedText.animate({ 'fill-opacity': 1 }, 250, 'easeInOutSine');
						});

					})(text, country);
				}
			}

		};
	}
);