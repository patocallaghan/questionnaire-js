/**
*
* @exports app/datavis/map
*/
define(
	[
		'jquery',
		'd3',
		'app/ui/datavis/data',
		'app/ui/datavis/infographic/donut',
		'pubsub'
	],
	function( $, d3, Data, Donut ) {

		var map;
		var projection;
		var mapData;
		var Regions;
		var areasContainer;
		var INNER_RADIUS = 10;

		return {
			init: function( settings ) {
				Regions = this;
				map = settings.mapGroup;
				projection = settings.projection;
				mapData = Data.getMapData();
				areasContainer = settings.areasContainer;
				this._initSubscriptions();
				this._renderRegions( Data.getScaleData( 'all' ) );
			},
			getCurrentRegion: function() {
				return d3.select( '.js-map-region.is-visible' );
			},
			_initSubscriptions: function() {
				$.subscribe( '/map/infographic/region/toggle', this._processRegionToggleEvent );
				$.subscribe( '/map/infographic/region/show', this._processRegionShowEvent );
				$.subscribe( '/map/infographic/region/change', this._processRegionChangeEvent );
				$.subscribe( '/map/filter/industry/change', this._processFilterChangeEvent );
				$.subscribe( '/map/zoom/default', this._processDefaultZoomEvent );
			},
			_processRegionToggleEvent: function( data ) {
				Regions._toggleRegion( data.visibility, data.region );
			},
			_processRegionShowEvent: function( data ) {
				Regions._showRegion( data.region );
				Regions._hideRegionIndicator( data.region );
			},
			_processDefaultZoomEvent: function() {
				Regions._showAllRegions();
				$.publish( '/map/location/change', [{
					location: '',
					isZoom: false
				}] );
			},
			_processRegionClicks: function() {
				var areaData = Data.getAreaData( this.id );
				Regions._changeToRegion( areaData, this );
				$.publish( '/map/labels/region/change', [{
					region: this.id
				}] );
			},
			_processRegionChangeEvent: function( data ) {
				var region = data.region;
				var thisArea = d3.select( '#' + region )[0][0];
				var areaData = Data.getAreaData( region );
				Regions._changeToRegion( areaData, thisArea );
			},
			_processFilterChangeEvent: function( data ) {
				Regions._updateRegionDonuts( Data.getScaleData( 'all' ), data.industries );
				Regions._updatePane( data.industries );
			},
			_renderRegions: function( scaleData ) {
				var scale = d3.scale.linear().domain( [0, d3.max( scaleData )] ).range( [0, 40] );
				var containerGroup = d3.select( '#js-map-main-group' ).insert( "g" ).attr( 'id', 'js-regions-container' );
				Donut.create( {
					data: mapData,
					containerGroup: containerGroup,
					clickCallback: Regions._processRegionClicks,
					cssClass: 'hot map-region-indicator js-region-indicator is-visible',
					projection: projection,
					marketResearch: {
						innerRadiusCallback: function() {
							return INNER_RADIUS;
						},
						outerRadiusCallback: function( d ) {
							return scale( d.articles.marketResearch ) + INNER_RADIUS;
						}
					},
					newsFeatures: {
						innerRadiusCallback: function( d ) {
							return scale( d.articles.marketResearch ) + INNER_RADIUS;
						},
						outerRadiusCallback: function( d ) {
							return scale( d.articles.marketResearch + d.articles.newsFeatures ) + INNER_RADIUS;
						}
					}
				} );
				//Ideally I'd like to append "donut" to the #js-map-main-group container here but can't figure it out
			},
			_updateRegionDonuts: function( scaleData, industries ) {
				var visibleClass = Regions._isRegionViewShowing() ? ' is-visible' : '';
				var scale = d3.scale.linear().domain( [0, d3.max( scaleData )] ).range( [0, 30] );
				d3.select( '#js-regions-container' ).remove();
				var containerGroup = d3.select( '#js-map-main-group' ).insert( "g" ).attr( 'id', 'js-regions-container' );
				Donut.create( {
					data: mapData,
					containerGroup: containerGroup,
					clickCallback: Regions._processRegionClicks,
					cssClass: 'hot map-region-indicator js-region-indicator' + visibleClass,
					projection: projection,
					marketResearch: {
						innerRadiusCallback: function( d ) {
							var total = 0;
							d.articles.sectors.forEach( function( sectorObj ) {
								if ( industries.indexOf( sectorObj.title ) > -1 ) {
									total += scale( sectorObj.marketResearch );
								}
								if( total > 0 ) {
									return false;
								}
							} );
							return total > 0 || !industries.length ? INNER_RADIUS : 0;
						},
						outerRadiusCallback: function( d ) {
							var total = 0;
							if ( !industries ) {
								total = scale( d.articles.marketResearch );
							} else {
								d.articles.sectors.forEach( function( sectorObj ) {
									if ( industries.indexOf( sectorObj.title ) > -1 ) {
										total += scale( sectorObj.marketResearch );
									}
								} );
							}
							return total > 0 || !industries.length ? total + INNER_RADIUS : 0;
						}
					},
					newsFeatures: {
						innerRadiusCallback: function( d ) {
							var innerRadius = 0;
							var newsFeaturesTotal = 0;
							var marketResearchTotal = 0;
							if ( !industries ) {
								marketResearchTotal = scale( d.articles.marketResearch );
								newsFeaturesTotal = scale( d.articles.newsFeaturesTotal );
							} else {
								d.articles.sectors.forEach( function( sectorObj ) {
									if ( industries.indexOf( sectorObj.title ) > -1 ) {
										marketResearchTotal += scale( sectorObj.marketResearch );
										newsFeaturesTotal += scale( sectorObj.newsFeatures );
									}
								} );
							}
							if( newsFeaturesTotal > 0 || !industries.length ) {
								innerRadius = marketResearchTotal === 0 ? newsFeaturesTotal + INNER_RADIUS : marketResearchTotal + INNER_RADIUS;
							} else if ( newsFeaturesTotal === 0 ) {
								innerRadius = 0;
							}
							return innerRadius;
						},
						outerRadiusCallback: function( d ) {
							var outerRadius = 0;
							var newsFeaturesTotal = 0;
							var marketResearchTotal = 0;
							if ( !industries ) {
								newsFeaturesTotal += scale(d.articles.newsFeatures);
								marketResearchTotal += scale(d.articles.marketResearch);
							} else {
								d.articles.sectors.forEach( function( sectorObj ) {
									if ( industries.indexOf( sectorObj.title ) > -1 ) {
										newsFeaturesTotal += scale(sectorObj.newsFeatures);
										marketResearchTotal += scale(sectorObj.marketResearch);
									}
								} );
							}
							if( newsFeaturesTotal > 0 || !industries.length ) {
								outerRadius = marketResearchTotal === 0 ? INNER_RADIUS : marketResearchTotal + newsFeaturesTotal + INNER_RADIUS;
							} else if ( newsFeaturesTotal === 0 ) {
								outerRadius = 0;
							}
							return outerRadius;
						}
					}
				} );
			},
			_changeToRegion: function( areaData, thisArea ) {
				Regions._hideAllRegionContainers();
				Regions._hideAllRegions();
				$.publish( '/map/infographic/zoom', [{
					area: thisArea,
					areaData: areaData
				}] );
				$.publish( '/map/location/change', [{
					location: areaData.name,
					isZoom: true,
					isRegion: true
				}] );
			},
			_toggleRegion: function( visibility, regionId ) {

				areasContainer.select( '[data-region-id="' + regionId + '"]' )
					.classed( 'is-' + visibility, true );

				$.publish( '/map/infographic/region/change', [{
					visibility: visibility
				}] );
			},
			_showRegion: function( regionId ) {

				areasContainer.select( '[data-region-id="' + regionId + '"]' )
					.classed( 'is-visible', true );

			},
			_hideRegion: function( regionId ) {
				areasContainer.select( '[data-region-id="' + regionId + '"]' )
					.classed( 'is-visible', false );
			},
			_hideRegionIndicator: function( regionId ) {
				map.select( '#' + regionId )
					.classed( 'is-visible', false );
			},
			_hideAllRegions: function() {
				map.selectAll( '.js-region-indicator' )
					.classed( 'is-visible', false );
			},
			_showAllRegions: function() {
				map.selectAll( '.js-region-indicator' )
					.classed( 'is-visible', true );
			},
			_hideAllRegionContainers: function() {
				map.selectAll( '.js-map-region' )
					.classed( 'is-visible', false );
			},
			_isRegionViewShowing: function(){
				return d3.selectAll('.js-region-indicator.is-visible')[0].length;
			},
			_updatePane: function( industries ){
				var filteredMediaLinks = [];
				if( Regions._isRegionViewShowing() ) {
					return false;
				}
				var currentRegion = Regions.getCurrentRegion();
				var regionData = Data.getAreaData( currentRegion.attr('data-region-id' ));

				if( !industries ) {
					filteredMediaLinks = regionData.mediaLinks;
				}

				if ( regionData.mediaLinks.length ) {
					regionData.mediaLinks.forEach( function(mediaLink, value){
						if( industries.indexOf(mediaLink.sector) > -1 ) {
							filteredMediaLinks.push( mediaLink );
						}
					} );

				}

				$.publish( '/map/pane/update', [{
					name: regionData.name,
					mediaLinks: filteredMediaLinks
				}] );

			}
		};
	}
);
