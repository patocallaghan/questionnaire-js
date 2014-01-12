/**
*
* @exports app/datavis/data
*/
define(
	[
		'jquery',
		'util/googleAnalyticsManager',
		'pubsub'
	],

	function ( $, GoogleAnalyticsManager ) {

		var Track;

		var trackingNames = {
			category: 'Map',
			actionRegion: 'Show Region',
			actionCountry: 'Show Country',
			actionBackMain: 'Back to Main',
			actionBackRegion: 'Back to Region',
			actionMarketResearch: 'Show Market Research Article',
			actionNewsFeatures: 'Show News & Features Article'
		};

		return {
			init: function () {
				Track = this;
				Track._initSubscriptions();
			},
			
			_initSubscriptions: function() {
				$.subscribe( '/map/track/region/show', this._trackShowRegionEvent );
				$.subscribe( '/map/track/country/show', this._trackShowCountryEvent );
				$.subscribe( '/map/track/market/link', this._trackMarketResearchEvent );
				$.subscribe( '/map/track/news/link', this._trackNewsFeaturesEvent );
				$.subscribe( '/map/track/button/backtoregion', this._trackButtonBackToRegionEvent );
				$.subscribe( '/map/track/button/backtomain', this._trackButtonBackToMainMenuEvent );
			},
			
			_trackShowRegionEvent: function ( data ) {
				var eventObj = {
					category: trackingNames.category,
					action: trackingNames.actionRegion,
					label: data.location.toLowerCase()
				};
				//console.log( '_trackShowRegionView', eventObj );
				GoogleAnalyticsManager.trackEvent( eventObj );
			},
			
			_trackShowCountryEvent: function ( data ) {
				var eventObj = {
					category: trackingNames.category,
					action: trackingNames.actionCountry,
					label: data.location.toLowerCase()
				};
				//console.log( '_trackShowCountryEvent', eventObj );
				GoogleAnalyticsManager.trackEvent( eventObj );
			},
			
			_trackButtonBackToMainMenuEvent: function ( data ) {
				var eventObj = {
					category: trackingNames.category,
					action: trackingNames.actionBackMain,
					label: 'From: ' + data.location.toLowerCase()
				};
				//console.log( '_trackButtonBackToMainMenuEvent', eventObj );
				GoogleAnalyticsManager.trackEvent( eventObj );
			},
			
			_trackButtonBackToRegionEvent: function ( data ) {
				var eventObj = {
					category: trackingNames.category,
					action: trackingNames.actionBackRegion,
					label: 'From: ' + data.location.toLowerCase()
				};
				//console.log( '_trackButtonBackToRegionEvent', eventObj );
				GoogleAnalyticsManager.trackEvent( eventObj );
			},
			
			_trackMarketResearchEvent: function ( data ) {
				var eventObj = {
					category: trackingNames.category,
					action: trackingNames.actionMarketResearch,
					label: data.location.toLowerCase() + ' | Article: ' + data.name + ', URL: ' + data.url
				};
				//console.log( '_trackMarketResearchEvent', eventObj );
				GoogleAnalyticsManager.trackEvent( eventObj );
			},
			
			_trackNewsFeaturesEvent: function ( data ) {
				var eventObj = {
					category: trackingNames.category,
					action: trackingNames.actionNewsFeatures,
					label: data.location.toLowerCase() + ' | Article: ' + data.name + ', URL: ' + data.url
				};
				//console.log( '_trackNewsFeaturesEvent', eventObj );
				GoogleAnalyticsManager.trackEvent( eventObj );
			},

		}

	}
);
