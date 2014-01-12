/**
*
* @exports app/datavis/infographic/labels
*/
define(
	[
		'jquery',
		'app/ui/datavis/data',
		'app/ui/datavis/infographic/infographic',
		'util/template',
		'throttledebounce',
		'require'
	],

	function ( $, Data, Infographic, Template ) {

		var Labels;
		var $labelsContainer;
		var $regionLabels;
		var $countryLabels;
		var labelsTemplate;
		var $mapContainer;

		return {
			init: function(){
				Labels = this;
				$labelsContainer = $('.js-map-labels');
				$mapContainer = $( '.js-map-interactive' );
				labelsTemplate = $('#js-map-labels-template').html();
				this._renderLabels();
				this._initEvents();
				this._initSubscriptions();
				$regionLabels = $labelsContainer.find( '.js-map-label--region' );
				$countryLabels = $labelsContainer.find( '.js-map-label--country' );
				Labels._positionLabelGroup( $regionLabels, 'region' );
			},
			hideAllCountryLabels: function() {
				Labels._hideAllCountryLabels();
			},
			_renderLabels: function(){
				var data = {
					labelsData: Data.getMapData()
				};
				var globalData = Data.getAreaData('global');
				var compiledTemplate = Template.compileTemplate( labelsTemplate, {
					labelsData: [globalData]
				} );
				$labelsContainer.html( compiledTemplate );
			},
			_initEvents: function(){
				$labelsContainer.on('click', '.js-map-label--region', this._processRegionLabelClick);
				$labelsContainer.on('click', '.js-map-label--country', this._processCountryLabelClick);
				$(window).on( 'resize', $.throttle(250, Labels._processResizeEvent) );
			},
			_initSubscriptions: function(){
				$.subscribe('/map/zoom/default', this._processZoomToDefaultEvent );
				$.subscribe('/map/labels/region/change', this._processRegionChangeEvent );
				$.subscribe('/map/labels/country/change', this._processCountryChangeEvent );
				$.subscribe('/map/labels/country/single', this._processSingleCountryEvent );
			},
			_processRegionLabelClick: function( event ){
				event.preventDefault();
				Labels._setRegionToSelected( $( this ) );
				$.publish( '/map/track/region/show', [{
					location: $( this ).text()
				}] );
			},
			_processCountryLabelClick: function( event ){
				event.preventDefault();
				Labels._setCountryToSelected($(this));
				$.publish( '/map/infographic/country/click', [{
					country: $(this).attr( 'data-country-id' )
				}] );
			},
			_processResizeEvent: function(){
				var $visibleRegionLabels = $('.js-map-label--region.is-visible');
				var $visibleCountryLabels = $('.js-map-label--country.is-visible');
				if( $visibleRegionLabels.length ){
					Labels._positionLabelGroup( $visibleRegionLabels, 'region' );
				}
				if( $visibleCountryLabels.length ) {
					Labels._positionLabelGroup( $visibleCountryLabels, 'country' );
				}
			},
			_processZoomToDefaultEvent: function(){
				Labels._hideAllCountryLabels();
				Labels._showAllRegionLabels();
			},
			_processRegionChangeEvent: function( data ){
				Labels._setRegionToSelected( $regionLabels.filter( '[data-region-id="' + data.region + '"]' ) );
			},
			_processCountryChangeEvent: function( data ){
				Labels._setCountryToSelected( $countryLabels.filter( '[data-country-id="' + data.country + '"]' ) );
			},
			_processSingleCountryEvent: function( data ){
				var country = data.country;
				Labels._hideAllCountryLabels();
				Labels._showSingleCountry( country );
			},
			_setCountryToSelected: function( $thisLabel ){
				var clickedCountry = $thisLabel.attr( 'data-country-id' );
				$labelsContainer.find( '.js-map-label--country.is-selected' )
					.removeClass( 'is-selected' );
				$thisLabel.addClass("is-selected");
			},
			_setRegionToSelected: function( $thisLabel ) {
				var region = $thisLabel.attr( 'data-region-id' );
				$.publish( '/map/infographic/region/change', [{
					region: region
				}] );
				Labels._hideAllRegionLabels();
				Labels._showAllCountriesPerRegion( region );
			},
			_showAllRegionLabels: function(){
				setTimeout( function(){
					$regionLabels.addClass( 'is-visible' );
				}, 750 );
			},
			_hideAllRegionLabels: function(){
				$regionLabels.removeClass( 'is-visible' );
			},
			_showSingleCountry: function( country ){
				var $country = $countryLabels.filter( '[data-country-id="' + country + '"]' );
				setTimeout( function(){
					Labels._positionLabelGroup( $countryLabels, 'country' );
					$country.addClass( 'is-selected is-visible' );
				}, 750 );
			},
			_showAllCountriesPerRegion: function( region ) {
				var $regionToShow = $labelsContainer.find( '[data-region-id="' + region + '"]' );
				var $countriesToShow = $regionToShow.next( '.js-map-labels--countries' )
					.find( '.js-map-label--country' );
				setTimeout( function(){
					Labels._positionLabelGroup( $countryLabels, 'country' );
					$countriesToShow.addClass( 'is-visible' );
				}, 1000 );
			},
			_hideAllCountryLabels: function(){
				$countryLabels.filter( '.is-selected' )
					.removeClass( 'is-selected' );
				$countryLabels.removeClass( 'is-visible' );
			},
			_positionLabelGroup: function( $labels, dataAttribute ){
				$labels.each( function(){
					var $thisLabel = $(this);
					var id = $(this).attr( 'data-' + dataAttribute + '-id' );
					var positionData = require('app/ui/datavis/infographic/infographic').getPositionData( id );

					var dataTopCenter = positionData.top;
					var dataLeftCenter = positionData.left;
					var labelPosTop = dataTopCenter - ( $thisLabel.outerHeight() / 2 ) + 8;
					var labelPosLeft = dataLeftCenter - ( $thisLabel.outerWidth() / 2 );

					if( id === 'global' ) {
						labelPosTop -= 7;
						labelPosLeft -= 57;
					}

					$thisLabel.css({
						top: labelPosTop + 'px',
						left: labelPosLeft + 'px'
					});
				} );
			}
		};

	}
);

