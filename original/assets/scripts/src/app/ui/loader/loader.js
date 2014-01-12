/* app/ui/loader/loader */

define(
	[
		'jquery',
		'pubsub'
	],

	function ( $ ) {

		var Loader;
		var $loader;

		return {
			init: function () {
				Loader = this;
				this._createLoader();
				$loader = $('#js-loader');
				this._initSubscriptions();
			},
			_createLoader: function () {
				var loader = document.createElement("div");
				loader.id = "js-loader";
				loader.className = 'loader';
				$('body').append(loader);
			},
			_initSubscriptions: function () {
				$.subscribe('/loader/show', $.proxy(this._showLoader, this));
				$.subscribe('/loader/hide', $.proxy(this._hideLoader, this));
			},
			_showLoader: function (data) {
				$loader.attr( 'class', 'loader' );
				if( data.theme ) {
					this._setTheme( data.theme );
				}
				if (data.element.length) {
					this._positionLoader( data.element, data.thresholdTop, data.thresholdLeft );
					$loader.css( "display", "block" );
				}
			},
			_hideLoader: function () {
				$loader.css("display", "none");
			},
			_setTheme: function( theme ) {
				$loader.addClass( 'loader--' + theme );
			},
			_positionLoader: function (element, thresholdTop, thresholdLeft) {
				var width = $loader.width();
				var height = $loader.height();
				var elPosition = element.offset();
				var elTop = elPosition.top;
				var elLeft = elPosition.left;
				var elHeight = element.outerHeight();
				var elWidth = element.outerWidth();
				var topPos = elTop + (elHeight / 2) - (height / 2);
				var leftPos = elLeft + (elWidth / 2) - (width / 2);
				if( thresholdTop ){
					topPos -= thresholdTop;
				}
				if( thresholdLeft ){
					leftPos -= thresholdLeft;
				}

				$loader.css({
					'top': topPos,
					'left': leftPos
				});
			}
		};
	}
);
