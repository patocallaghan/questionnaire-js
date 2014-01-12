/**
*
* @exports app/datavis/infographic/countrie.json
*/
define(
	[
		'jquery',
		'd3',
		'app/ui/datavis/data',
		'app/ui/datavis/infographic/donut',
		'app/ui/datavis/filter',
		'pubsub'
	],

	function ( $, d3, Data, Donut, Filter ) {

		var Countries;
		var projection;
		var mapData;
		var countriesContainer;

		return {
			init: function( settings ) {
				Countries = this;
				projection = settings.projection;
				countriesContainer = settings.areasContainer;
				mapData = Data.getMapData();
				this._initSubscriptions();
				this._renderCountries();
			},
			_initSubscriptions: function() {
				$.subscribe( '/map/infographic/country/show', this._processShowCountryEvent );
				$.subscribe( '/map/infographic/region/show', this._processRegionShowEvent );
				$.subscribe( '/map/infographic/country/click', this._processCountryClickEvent );
				$.subscribe( '/map/filter/industry/change', this._processFilterChangeEvent );
				$.subscribe( '/tooltip/close', this._processTooltipClosedEvent );
				$.subscribe( '/map/zoom/default', this._processDefaultZoomEvent );
			},
			_processShowCountryEvent: function( data ) {
				Countries._showSingleCountryInRegion( data.country, data.region );
			},
			_processRegionShowEvent: function( data ) {
				Countries._showAllCountriesPerRegion( data.region );
			},
			_processTooltipClosedEvent: function(){
				Countries._deselectSelectedCountry();
			},
			_processDefaultZoomEvent: function() {
				Countries._hideAllCountries();
			},
			_processCountryClickEvent: function( data ) {
				var $thisCountry = $( '#' + data.country );
				Countries._setCountryToSelected( $thisCountry[0] );
				var industries = Filter.getCurrentlySelectedFilters();
				Countries._updatePane( industries );
			},
			_processFilterChangeEvent: function( data ) {
				Countries._updateCountryDonuts( data.industries );
				Countries._updatePane( data.industries );
				Countries._updateTooltip( data.industries );
			},
			_renderCountries: function() {
				mapData.forEach( function( areaData ) {
					var regionId = areaData.id;
					var countriesGroup = countriesContainer.insert( "g", ".map-interactive-graticule" )
						.attr( 'data-region-id', regionId )
						.classed( 'map-region js-map-region', true );
					Countries._createCountryData( areaData, countriesGroup );
				} );
			},
			_createCountryData: function( areaData, countriesGroup ) {
				var regionId = areaData.id;
				var countries = areaData.countries;
				var rangeData = areaData.range;
				var rangeMax = rangeData.rangeMax;
				var INNER_RADIUS = rangeData.innerRadius;
				var scaleData = Data.getScaleData( regionId );
				var scale = d3.scale.linear().domain( [0, d3.max( scaleData )] ).range( [0, rangeMax] );

				Donut.create( {
					data: countries,
					clickCallback: Countries._processCountryClicks,
					containerGroup: countriesGroup,
					cssClass: 'hot map-country js-region-countries',
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
			_updateCountryDonuts: function( industries ) {
				var isCountryViewShowing = Countries._isCountryViewShowing();
				var visibleMapRegion = d3.select('.js-map-region.is-visible');
				var mapRegion = visibleMapRegion[0][0] ? visibleMapRegion.attr('data-region-id') : '';
				d3.select( '#js-countries-container' ).remove();
				countriesContainer = d3.select( '#js-map-main-group' ).insert( "g" ).attr( 'id', 'js-countries-container' );
				mapData.forEach( function( areaData ) {
					var regionId = areaData.id;
					var visibleClass = isCountryViewShowing && mapRegion === areaData.id ? ' is-visible' : '';
					var countriesGroup = countriesContainer.insert( "g", ".map-interactive-graticule" )
						.attr( 'data-region-id', regionId )
						.classed( 'map-region js-map-region' + visibleClass, true );
					var scaleData = Data.getScaleData( regionId );
					Countries._updateCountryData( areaData, scaleData, countriesGroup, industries, visibleClass );
				} );
			},
			_updateCountryData: function( areaData, scaleData, countriesGroup, industries, isVisible ){

				var regionId = areaData.id;
				var countries = areaData.countries;
				var rangeData = areaData.range;
				var rangeMax = rangeData.rangeMax;
				var INNER_RADIUS = rangeData.innerRadius;
				var scale = d3.scale.linear().domain( [0, d3.max( scaleData )] ).range( [0, rangeMax] );

				Donut.create( {
					data: countries,
					clickCallback: Countries._processCountryClicks,
					containerGroup: countriesGroup,
					cssClass: 'hot map-country js-region-countries' + isVisible,
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
								newsFeaturesTotal = scale( d.articles.newsFeatures );
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
				//Ideally I'd like to append "donut" to the #js-map-main-group container here but can't figure it out
			},
			_updateTooltip: function( industries ) {
				var countryDataFiltered = {};
				var currentSelectedCountryId = Countries._getCurrentSelectedCountry();
				if( !currentSelectedCountryId || !Countries._isCountryViewShowing() ) {
					return false;
				}
				var countryData = Data.getAreaData( currentSelectedCountryId );
				var linkList = Countries._generateLinkList( countryData );
				countryDataFiltered.name = countryData.name;
				countryDataFiltered.url = countryData.url;
				countryDataFiltered.linkList = linkList;
				$.publish('/tooltip/update', [{
					tooltipData: countryDataFiltered
				}]);
			},
			_processCountryClicks: function() {
				$.publish( '/map/labels/country/change', [{
					country: this.id
				}] );
				Countries._setCountryToSelected( this );
			},
			_setCountryToSelected: function( country ) {
				var $thisCountry = $( country );
				var areaData = Data.getAreaData( country.id );

				$.publish( '/map/track/country/show', [{
					location: areaData.name
				}] );

				if ( areaData.zoom ) {
					$.publish( '/map/infographic/zoom', [{
						area: country,
						areaData: areaData
					}] );
					$.publish( '/map/labels/country/single', [{
						country: areaData.id
					}] );
					$.publish( '/map/location/change', [{
						location: areaData.name,
						isZoom: true
					}] );
					setTimeout( function() {
						Countries._openCountryInfo( $thisCountry[0] );
					}, 750 );
					return;
				}
				$.publish( '/map/location/change', [{
					location: areaData.name,
					isZoom: false
				}] );
				$.publish( '/map/pane/show', [{
					areaData: areaData
				}] );
				Countries._openCountryInfo( country );
			},
			_openCountryInfo: function (area) {
				var ctmPos = area.getCTM();
				var countryId = area.id;
				var regionId = $(area).parent().attr('data-region-id');
				var countryData = Data.getAreaData(regionId, countryId);
				if (typeof countryData.linkList == "undefined") {
					var linkList = Countries._generateLinkList( countryData );
					countryData['linkList'] = linkList;
				}

				$.publish('/tooltip/show', [{
					tooltipData: countryData,
					regionId: regionId,
					countryId: countryId,
					top: ctmPos.f - 20,
					left: ctmPos.e + 14
				}]);
				this._watchTootipLinks();
			},
			_showAllCountriesPerRegion: function( regionId ) {
				d3.select( '.js-map-region[data-region-id="' + regionId + '"]' ).classed( 'is-visible', true );
				var countries = Countries._getAllCountriesInARegion( regionId ).classed( 'is-visible', true );
				if( countries[0].length === 1 ) {
					var country = d3.selectAll('.js-region-countries.is-visible')[0][0];
					Countries._setCountryToSelected( country );
				}
			},
			_showSingleCountryInRegion: function( countryId, regionId ) {
				Countries._getAllCountriesInARegion( regionId ).each( function() {
					var addClass = false;
					if ( this.id === countryId ) {
						addClass = true;
					}
					d3.select( this ).classed( 'is-visible', addClass );
				} );
			},
			_hideAllCountries: function() {
				Countries._getAllCountryContainers().classed( 'is-visible', false );
				Countries._getAllCountries().classed( 'is-visible', false );
			},
			_getAllCountriesInARegion: function( regionId ) {
				return countriesContainer.selectAll( '[data-region-id="' + regionId + '"]' ).selectAll( '.js-region-countries' );
			},
			_getAllCountries: function() {
				return countriesContainer.selectAll( '.js-region-countries' );
			},
			_getAllCountryContainers: function() {
				return countriesContainer.selectAll( '.js-map-region' );
			},
			_watchTootipLinks: function() {
				var $tooltipList = $( '.js-map-tooltip-list' );
				$tooltipList.on( 'click', '.js-map-tooltip-link', function() {
					var $link = $( this );
					$.publish( '/map/track/market/link', [{
						location: $tooltipList.attr( 'data-location' ),
						name: $link.text(),
						url: $link.attr( 'href' )
					}] );
				} );
			},
			_isCountryViewShowing: function(){
				return d3.selectAll('.js-region-countries.is-visible')[0].length;
			},
			_generateLinkList: function( countryData ){
				var links = [];
				var filteredOptions = Filter.getCurrentlySelectedFilters();
				var optionsArray = filteredOptions.split(',');
				var sectors = countryData.articles.sectors;
				sectors.forEach( function( sectorObj ) {
					var sectorTitle = Countries._getSectorTitleFromLink( sectorObj.title );
					if(sectorObj.marketResearch && !filteredOptions || optionsArray.indexOf(sectorTitle) > -1) {
						links.push( sectorObj );
					}
				} );
				return links;
			},
			_updatePane: function( industries ){
				var filteredMediaLinks = [];
				var currentSelectedCountryId = Countries._getCurrentSelectedCountry();
				if( !currentSelectedCountryId || !Countries._isCountryViewShowing() ) {
					return false;
				}
				var countryData = Data.getAreaData( currentSelectedCountryId );

				if( !industries ) {
					filteredMediaLinks = countryData.mediaLinks;
				}

				if ( countryData.mediaLinks.length ) {
					countryData.mediaLinks.forEach( function(mediaLink, value){
						if( industries.indexOf(mediaLink.sector) > -1 ) {
							filteredMediaLinks.push( mediaLink );
						}
					} );
				}

				$.publish( '/map/pane/update', [{
					name: countryData.name,
					mediaLinks: filteredMediaLinks
				}] );

			},
			_getCurrentSelectedCountry: function(){
				return $('.js-map-label--country.is-selected').attr('data-country-id');
			},
			_deselectSelectedCountry: function(){
				$( '.js-map-label--country.is-selected' ).removeClass('is-selected');
			},
			_getSectorTitleFromLink: function( sectorTitle ){

				if( sectorTitle.indexOf('(') === -1 ) {
					return sectorTitle;
				}

				return sectorTitle.substring(0, sectorTitle.indexOf('(') - 1 );

			}
		};
	}
);
