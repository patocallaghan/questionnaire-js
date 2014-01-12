/**
*
* @exports app/datavis/filter
*/
define(
	[
		'jquery',
		'util/template',
		'pubsub'
	],
	function ($, Template) {

		var Filter;
		var $filter;
		var $filterStatus;
		var $filterList;
		var $filterToggleButton;
		var $filterOptions;
		var $filterShowAll;

		return {
			init: function () {
				Filter = this;
				$filter = $('#js-map-filter');
				$filterHeading = $('#js-map-filter-heading');
				$filterStatus = $('#js-map-filter-status');
				$filterToggleButton = $('#js-map-filter-toggle');
				$filterList = $('#js-map-filter-list');
				$filterShowAll = $filterList.find('.js-map-filter-show-all');
				$filterOptions = $filterList.find('.js-map-filter-btn').not($filterShowAll);

				this._initEvents();
				this._initSubscriptions();

				//Seems weird to me close the filter at the start?
				this._closeFilter();
			},

			getCurrentlySelectedFilters: function(){
				return Filter._getSelectedOptions().join(',');
			},

			_currentIndustry: 'All',
			_currentLocation: '',

			_initEvents: function () {
				$filterHeading.on('click', Filter._filterListToggle);
				$filterList.on('click', '.js-map-filter-btn', Filter._filterOptionClick);
				$filterList.on('click', '.js-map-filter-show-all', Filter._filterShowAllClick);
			},

			_initSubscriptions: function () {
				$.subscribe('/map/filter/view/full', Filter._expandFilter);
				$.subscribe('/map/filter/view/compact', Filter._hideFilter);
				$.subscribe('/map/location/change', Filter._updateLocationText);
			},

			_closeFilter: function(){
				$filterToggleButton.trigger( 'click' );
			},

			_filterListToggle: function (event) {
				event.preventDefault();

				if ($filter.hasClass('is-expanded')) {
					Filter._hideFilter();
					return;
				}
				Filter._expandFilter();
			},

			_filterOptionClick: function (event) {
				event.preventDefault();
				var $filterOption = $(this);

				$filterOption.toggleClass('is-selected');
				$filterShowAll.removeClass('is-selected');
				Filter._updateFilterStatus();
			},

			_filterShowAllClick: function (event) {
				event.preventDefault();
				$filterOptions.removeClass('is-selected');
				Filter._selectFilterShowAll();
				Filter._updateFilterStatus();
			},

			_expandFilter: function () {
				$filter.addClass('is-expanded');
			},

			_hideFilter: function () {
				$filter.removeClass('is-expanded');
			},

			_updateFilterStatus: function () {
				var selectionTextArray = Filter._getSelectedOptions();
				var selectionText = selectionTextArray.join(',');

				if ( !selectionTextArray.length ) {
					$.publish('/map/filter/industry/change', { industries: selectionText });
					Filter._selectFilterShowAll();
					Filter._updateIndustryText(selectionTextArray);
					return;
				}

				$.publish('/map/filter/industry/change', { industries: selectionText });
				Filter._updateIndustryText(selectionTextArray);
			},

			_getSelectedOptions: function(){
				var selectionTextArray = [];
				var $selectedFilterOptions = $filterOptions.filter('.is-selected');

				if( !$selectedFilterOptions.length ) {
					return selectionTextArray;
				}

				for (var i = 0, length = $selectedFilterOptions.length; i < length; i++) {
					selectionTextArray.push($selectedFilterOptions[i].textContent);
				}

				return selectionTextArray;

			},

			_updateIndustryText: function (data) {
				var industryHtml = 'All';

				if (typeof data === 'object' && data.length > 0) {
					var industriesLength = data.length;
					var industry;

					if (industriesLength === 1) {
						industry = data[0];
					} else {
						industry = industriesLength.toString() + " industries";
					}
					industryHtml = '<strong>' + industry + '</strong>';
				}
				Filter._currentIndustry = industryHtml;
				Filter._updateStatusText();
			},

			_updateLocationText: function (data) {

				if (typeof data.location === 'string' && data.location != '') {
					Filter._currentLocation = ' in <strong>' + data.location + '</strong>';
				} else {
					Filter._currentLocation = '';
				}
				Filter._updateStatusText();
			},

			_updateStatusText: function () {
				$filterStatus.html('Showing ' + Filter._currentIndustry + Filter._currentLocation);
			},

			_selectFilterShowAll: function () {
				$filterShowAll.addClass('is-selected');
				Filter._updateIndustryText('');
			}
		};

	}
);
