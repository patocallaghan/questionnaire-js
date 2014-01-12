/**
*
* @exports app/datavis/infographic/donut
*/
define(
	[
		'jquery',
		'd3'
	],

	function ( $, d3 ) {

		var MARKET_RESEARCH_FILL = '#568bc1';
		var NEWS_FEATURES_FILL = '#87cc33';
		var MARKET_RESEARCH_OPACITY = 0.9;
		var NEWS_FEATURES_OPACITY = 0.7;

		return {
			create: function( settings ){
				var marketResearchArc = this._createArc({
					innerRadiusCallback: settings.marketResearch.innerRadiusCallback,
					outerRadiusCallback: settings.marketResearch.outerRadiusCallback
				});
				var newsFeaturesArc = this._createArc({
					innerRadiusCallback: settings.newsFeatures.innerRadiusCallback,
					outerRadiusCallback: settings.newsFeatures.outerRadiusCallback
				});
				var donuts = settings.containerGroup.selectAll( "path" ).data( settings.data );
				var singleDonut = this._createParentGroup( settings, donuts );
				this._appendDonutArcToGroup( singleDonut, MARKET_RESEARCH_FILL, marketResearchArc, 'js-donut--market-research', MARKET_RESEARCH_OPACITY );
				this._appendDonutArcToGroup( singleDonut, NEWS_FEATURES_FILL, newsFeaturesArc, 'js-donut--news-features', NEWS_FEATURES_OPACITY );
			},
			_createParentGroup: function( settings, container ){

				return container.enter()
					.append("g")
					.attr( "id", function ( d ) {
						return d.id;
					} )
					.attr( "transform", function ( d ) {
						return 'translate(' + settings.projection( [d.coordinates.lon, d.coordinates.lat] )[0] + ',' + settings.projection( [d.coordinates.lon, d.coordinates.lat] )[1] + ')';
					} )
					.on( "click", settings.clickCallback )
					.each( this._appendGlobalIcon )
					.classed( settings.cssClass, true );
			},
			_appendDonutArcToGroup: function( group, fill, arc, cssClass, opacity ){
				group.append( "path" )
					.style( {
						opacity: opacity,
						fill: fill
					} )
					.attr('class', cssClass)
					.attr('d', arc);
			},
			_createArc: function( settings ) {
				var FULL_CIRCLE = Math.PI*2;
				return d3.svg.arc()
						.innerRadius( settings.innerRadiusCallback )
						.outerRadius( settings.outerRadiusCallback )
						.startAngle( 0 )
						.endAngle( FULL_CIRCLE );
			},
			_appendGlobalIcon: function( d ){
				if( d.id === 'global' ) {
					d3.select(this).append('svg:image')
						.attr("xlink:href", '/images/interface/svg/earth.svg')
						.attr('width', 55)
						.attr('height', 55)
						.attr('x', -85)
						.attr('y', -28);
				}
			}
		};

	}
);


