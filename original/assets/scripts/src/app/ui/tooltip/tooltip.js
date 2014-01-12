/**
*
* @exports app/tooltip/tooltip
*/
define(
	[
		'jquery',
		'd3',
		'app/ui/datavis/data',
		'util/template',
		'pubsub'
	],
	function ($, d3, Data, Template ) {

		var Tooltip;
		var $tooltip = $("#js-tooltip");
		var tooltipTemplate = $('#js-tooltip-template').html();

		return {
			init: function () {
				Tooltip = this;
				$tooltip = $("#js-tooltip");
				tooltipTemplate = $('#js-tooltip-template').html();
				this._initEvents();
				this._initSubscriptions();
			},
			_initEvents: function () {
				$tooltip.on('click', '.js-tooltip__close', this._closeTooltip);
				$(window).on('resize', $.throttle(250, Tooltip._processResizeEvent));
				$('body').on('click', this._processBodyClick);
			},
			_initSubscriptions: function () {
				$.subscribe('/tooltip/show', this._showTooltip);
				$.subscribe('/tooltip/hide', this._hideTooltip);
				$.subscribe('/tooltip/update', this._updateTooltip);
			},
			_showTooltip: function (data) {
				var regionId = '';
				var countryId = '';

				Tooltip._populateTooltip(data.tooltipData);
				Tooltip._positionTooltip(data.top, data.left);
				$tooltip.addClass('is-visible');

				if (typeof data.tooltipData.zoom !== 'object') {
					regionId = data.regionId;
					countryId = data.countryId;
				}
				$tooltip.attr('data-regionId', regionId);
				$tooltip.attr('data-countryId', countryId);
			},
			_closeTooltip: function (event) {
				event.preventDefault();
				var regionId = $tooltip.attr('data-regionId');
				Tooltip._hideTooltip();

				if (regionId !== '') {
					var regionData = Data.getAreaData(regionId);
					$.publish('/map/pane/show', { areaData: regionData });
				}
				$.publish( '/tooltip/close' );
			},
			_processBodyClick: function( event ){
				var clickedElement = d3.select(event.target);
				var className = clickedElement.attr( 'class' );
				var isCountryClicked = /(js\-map\-label\-\-country|js\-donut\-\-news\-features|js\-donut\-\-market\-research)/.exec(className);
				if( $tooltip.is( '.is-visible' ) && (!isCountryClicked || !isCountryClicked.length) ) {
					Tooltip._closeTooltip( event );
				}
			},
			_hideTooltip: function () {
				$tooltip.removeClass('is-visible');
				$tooltip.attr('data-regionId', '');
				$tooltip.attr('data-countryId', '');
			},
			_positionTooltip: function (top, left) {
				$tooltip.css({
					top: top,
					left: left
				});
			},
			_updateTooltip: function( data ){
				Tooltip._populateTooltip( data.tooltipData );
			},
			_populateTooltip: function (data) {
				var templateOutput = Template.compileTemplate(tooltipTemplate, data);
				$tooltip.html(templateOutput);
			},
			_processResizeEvent: function () {
				if (!$tooltip.is('.is-visible')) {
					return;
				}
				var countryId = $tooltip.attr('data-countryId');
				var openCountry = d3.select('#' + countryId);

				if (openCountry[0].length) {
					var ctmPos = openCountry[0][0].getCTM();
					var data = {
						top: ctmPos.f - 20,
						left: ctmPos.e + 14
					};
					Tooltip._positionTooltip(data.top, data.left);
				}
			}
		};
	}
);
