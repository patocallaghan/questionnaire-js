/**
*
* @exports app/datavis/data
*/
define(
	[
		'jquery',
		'd3',
		'pubsub'
	],

	function ( $, d3 ) {

		var Data;
		var exportMarketsData;
		var regionalScaleData = [];
		// var DATA_URL = '/scripts/src/app/ui/datavis/geo/test-data.json';
		var DATA_URL = '/data-visualisation/data.json';

		return {
			init: function(){
				Data = this;
				var promise = this._getExportMarketsData();
				promise.done( this._processDataResponse ).error( this._processDataError );
			},
			getMapData: function(){
				return exportMarketsData;
			},
			getScaleData: function(region){
				return regionalScaleData[region];
			},
			getFilteredScale: function( industries ){
				var scale = [];

				if ( !industries.length ) {
					return regionalScaleData['all'];
				}

				exportMarketsData.forEach(function(areaObj, index){
					var totalMarketResearch = 0;
					var totalNewsFeatures = 0;
					areaObj.articles.sectors.forEach(function( sectorObj ){
						var sectorName = sectorObj.title;
						if( industries.indexOf( sectorName ) ){
							totalMarketResearch += sectorName.marketResearch;
							totalNewsFeatures += sectorName.newsFeatures;
						}
					});
					scale.push( totalMarketResearch );
					scale.push( totalNewsFeatures );
				});
			},
			getAreaData: function ( areaId, regionId ) {
				var area;
				if ( regionId ) {
					return Data._getCountryData( areaId, regionId );
				}

				exportMarketsData.forEach( function(areaObj, index) {
					if( areaObj.id === areaId ) {
						area = areaObj;
						return false;
					}
					if ( areaObj.countries ) {
						areaObj.countries.forEach( function( subAreaObj, innerIndex ){
							if( subAreaObj.id === areaId ) {
								area = subAreaObj;
								return false;
							}
						} );
					}
				} );
				return area;
			},
			getGlobalCountry: function(){
				var countryId = '';
				exportMarketsData.forEach(function( region, index ){
					//This is dependent on the Global Region Node name
					if( region.name === 'Global') {
						countryId = region.countries[0].id;
						return false;
					}
				});
				return countryId;
			},
			_generateRegionalScaleData: function(){
				regionalScaleData['all'] = Data._generateScaleData( 'all' );
				exportMarketsData.forEach(function( areaObj, index ){
					regionalScaleData[areaObj.id] = Data._generateScaleData( areaObj.id );
				});
			},
			_generateScaleData: function(region){

				var scaleData = [];
				exportMarketsData.forEach(function( areaObj, index ){
					if( region === 'all' ) {
						scaleData.push(areaObj.articles.newsFeatures);
						scaleData.push(areaObj.articles.marketResearch);
					} else if( region === areaObj.id ){
						areaObj.countries.forEach(function( countryObj, index ){
							scaleData.push(countryObj.articles.newsFeatures);
							scaleData.push(countryObj.articles.marketResearch);
						});
					}
				});
				return scaleData;
			},
			_getCountryData: function ( regionId, countryId ) {
				var countryData;
				var region;
				exportMarketsData.forEach(function( region, index ){
					region = exportMarketsData[index];
					if( regionId === region.id ) {
						var countries = region.countries;
						countries.forEach( function( country, innerIndex ){
							if( countryId === country.id ) {
								countryData = countries[innerIndex];
								return false;
							}
						});
						return false;
					}
				});
				return countryData;
			},
			_processDataResponse: function( data ){
				Data._saveExportMarketsData( data );
				Data._generateRegionalScaleData();
				Data._publishDataReadyEvent();
			},
			_processDataError: function( error ){
				console.error( 'Data Visualisation JSON Format Error:', error );
			},
			_getExportMarketsData: function(){

				return $.ajax({
					url: DATA_URL,
					dataType: 'json',
					//For demo purposes
					cache: false
				});

			},
			_saveExportMarketsData: function( json ){
				exportMarketsData = json;
			},
			_publishDataReadyEvent: function() {
				$.publish( '/map/data/ready', [{
					exportMarketsData: exportMarketsData
				}] );
			}
		};

	}
);
