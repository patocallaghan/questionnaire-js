/**
*
* @exports app/datavis/pane
*/
define(
	[
		'jquery',
		'util/template',
		'pubsub'
	],

	function ($, Template) {

		var Pane;
		var $pane;
		var mediaLinksTemplate;

		return {
			init: function () {
				Pane = this;
				$pane = $('#js-map-pane');
				mediaLinksTemplate = $('#js-news-features-template').html();
				this._initSubscriptions();
				this._initEvents();
				this._watchPaneLinks();
			},

			_initSubscriptions: function () {
				$.subscribe('/map/pane/show', this._showPane);
				$.subscribe('/map/pane/hide', this._hidePane);
				$.subscribe('/map/pane/update', this._updatePane);
			},

			_initEvents: function () {
				$pane.on('click', '#js-map-pane-toggle', this._togglePaneHeight);
			},

			_showPane: function (data) {
				if (data) {
					var areaData = data.areaData;
					var templateOutput = Template.compileTemplate(mediaLinksTemplate, areaData);
					$pane.html(templateOutput);
				}
				$pane.addClass('is-visible');
			},

			_hidePane: function () {
				$pane.addClass('is-hidden').removeClass('is-visible');
			},

			_updatePane: function( data ){
				// {
				// 	name: 'Europe',
				// 	mediaLinks: []
				// }
				var templateOutput = Template.compileTemplate(mediaLinksTemplate, data);
				$pane.html(templateOutput);
			},

			_togglePaneHeight: function (event) {
				event.preventDefault();
				$pane.toggleClass('is-expanded');
			},

			_watchPaneLinks: function () {
				$pane.on('click', '.js-map-pane-link', function (event) {
					var $link = $(this);
					var location = $pane.find('.js-map-pane-list').attr('data-location');
					$.publish('/map/track/news/link', [{
						location: location,
						name: $link.text(),
						url: $link.attr('href')
					}]);
				});
			}
		};
	}
);
