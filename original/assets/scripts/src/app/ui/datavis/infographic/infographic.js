/**
*
* @exports app/datavis/infographic
*/
define(
	[
		'jquery',
		'd3',
		'app/ui/datavis/data',
		'app/ui/datavis/infographic/regions',
		'app/ui/datavis/infographic/countries',
		'app/ui/datavis/infographic/labels',
		'pubsub'
	],

	function ($, d3, Data, Regions, Countries, Labels) {

		var Infographic;
		var path;
		var svg;
		var mapGroup;
		var mapData;
		var areasContainer;
		var projection;
		var boundary;
		var WIDTH = 960;
		var HEIGHT = 500;
		var JSON_URL = '/scripts/src/app/ui/datavis/geo/world-110m2.json';

		return {
			init: function() {
				Infographic = this;
				$.publish('/loader/show', [{
					element: $( '#js-map' ),
					theme: 'light',
					thresholdTop: $('#js-map-filter').outerHeight()
				}]);
				this._initSubscriptions();
			},
			getPositionData: function( id ) {
				var region = d3.select( '#' + id );
				var size = region[0][0].getBoundingClientRect();
				var position = region[0][0].getCTM();
				return {
					left: position.e,
					top: position.f,
					width: size.width,
					height: size.height
				};
			},
			getProjection: function(){
				return projection;
			},
			_initSubscriptions: function() {
				$.subscribe( '/map/data/ready', this._processDataReadyEvent );
				$.subscribe( '/map/zoom/default', this._processZoomToDefaultView );
				$.subscribe( '/map/zoom/region', this._processZoomToRegion );
				$.subscribe( '/map/infographic/zoom', this._processZoomEvent );
				$.subscribe( '/map/infographic/region/show', this._processRegionShowEvent );
			},
			_processDataReadyEvent: function( data ) {
				Infographic._renderMap( data.exportMarketsData );
				Infographic._showMap();
				$.publish( '/loader/hide' );
			},
			_processZoomEvent: function( data ) {
				var area = data.area;
				var areaData = data.areaData;
				Infographic._zoomToArea( area, areaData );
			},
			_processZoomToRegion: function( data ) {
				var region = Regions.getCurrentRegion()[0][0];
				var regionId = Infographic._getAreaId( region );
				Labels.hideAllCountryLabels();
				Infographic._zoomToArea( region );
				$.publish( '/map/infographic/region/show', [{
					region: regionId
				}] );
				$.publish( '/map/labels/region/change', [{
					region: regionId
				}] );
			},
			_processRegionShowEvent: function( data ) {
				Infographic._toggleBoundaryVisibility( 'visible' );
			},
			_renderMap: function( json ) {
				mapData = json;
				this._createProjection();
				this._createSVG();
				var promise = this._retrieveGeoJSON();
				promise.done( this._renderVisuals );
			},
			_createSVG: function() {

				//Add SVG to the page
				svg = d3.select( "#js-map" ).append( "svg" )
					.attr( "viewBox", "0 0 " + WIDTH + " " + HEIGHT )
					.attr( "preserveAspectRatio", "xMidYMin" )
					.attr( "id", "js-map-svg" )
					.classed( 'map-interactive-Infographic', true );

				mapGroup = svg.insert( "g" ).attr( "id", "js-map-main-group" ).style('opacity', 0);

				path = d3.geo.path()
					.projection( projection );
			},
			_createProjection: function() {
				projection = d3.geo.equirectangular()
					.scale( 153 )
					.translate( [WIDTH / 2, HEIGHT / 2] )
					.rotate( [-150, 0] );
			},
			_retrieveGeoJSON: function() {
				return $.ajax( {
					url: JSON_URL,
					dataType: "json"
				} );
			},
			_renderVisuals: function( world ) {
				Infographic._createContinents( world );
				Infographic._createCountryBoundaries( world );
				Infographic._createRegionsAndCountries();
				Labels.init();
			},
			_createContinents: function( world ) {
				mapGroup.insert( "path", ".graticule" )
					.datum( topojson.feature( world, world.objects.land ) )
					.attr( "class", "map-interactive-land" )
					.attr( "d", path );
			},
			_createCountryBoundaries: function( world ) {
				boundary = mapGroup.insert( "path", ".map-interactive-graticule" )
					.datum( topojson.mesh( world, world.objects.countries, function( a, b ) { return a !== b; } ) )
					.attr( "class", "map-interactive-boundary" )
					.attr( "d", path )
					.style('opacity', 0.4)
					.style( "visibility", "hidden" );
			},
			_createRegionsAndCountries: function() {
				areasContainer = mapGroup.insert( "g", ".map-interactive-graticule" )
					.attr( 'id', 'js-countries-container' );

				var settings = {
					areasContainer: areasContainer,
					mapGroup: mapGroup,
					projection: projection
				};
				Regions.init( settings );
				Countries.init( settings );
			},
			_processZoomToDefaultView: function() {
				Infographic._resetZoom();
				Infographic._toggleBoundaryVisibility( 'hidden' );
			},
			_toggleBoundaryVisibility: function( visibility ) {
				boundary.style( 'visibility', visibility );
			},
			_zoomToArea: function( areaElem, areaData ) {
				var areaId = Infographic._getAreaId( areaElem );
				areaData = Data.getAreaData( areaId );
				this._zoomMap( areaElem, areaId, function() {
					var $areaElem = $( areaElem );
					if ( $areaElem.attr( 'class' ).indexOf( 'js-region-indicator' ) > -1 ) {
						$.publish( '/map/infographic/region/show', [{
							region: areaId
						}] );
					} else {
						var $regionElem = $areaElem.parent();
						$.publish( '/map/infographic/country/show', [{
							country: areaId,
							region: $regionElem.attr( 'data-region-id' )
						}] );
					}
					$.publish( '/map/button/show', [{
						areaId: areaId
					}] );
				} );

				$.publish( '/tooltip/hide' );
				$.publish( '/map/pane/show', [{
					areaData: areaData
				}] );

			},
			_zoomMap: function( areaElem, areaId, callback ) {

				var clickedArea = d3.select( areaElem );
				var areaData = Data.getAreaData( areaId );
				var areaZoom = areaData.zoom;
				var translateX = areaZoom.translateX;
				var translateY = areaZoom.translateY;
				var level = areaZoom.level;

				mapGroup.transition()
					.duration( 750 )
					.attr( "transform", "translate(" + translateX + "," + translateY + ")scale(" + level + ")" )
					.each( 'end', function() {
						callback( clickedArea );
					} );
			},
			_resetZoom: function() {
				mapGroup.transition()
					.duration( 750 )
					.attr( "transform", "translate(0,0)scale(1)" );
			},
			_getAreaId: function( areaElem ) {
				var $areaElem = d3.select( areaElem );
				var className = $areaElem.attr( 'class' );
				return className.indexOf( 'js-map-region' ) > -1 ? $areaElem.attr( 'data-region-id' ) : $areaElem.attr( 'id' );
			},
			_showMap: function(){
				d3.select('#js-map-main-group')
					.transition()
					.duration(1000)
					.ease('linear')
					.style('opacity', 1);
			}
		};
	}
);
