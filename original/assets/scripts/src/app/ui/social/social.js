/* app/ui/social/social */

define(
	[
		'jquery',
		'app/ui/popup/popup'
	],
	
	function ( $, Popup ) {
		
		var Social;

		return {

			init: function(){
				Social = this;
				$('.js-social-popup').on('click', this._processClick);
			},

			_processClick: function (event) {
				event.preventDefault();
				var $thisLink = $(this);
				var width = $thisLink.attr('data-social-width') ? $thisLink.attr('data-social-width') : 550;
				var height = $thisLink.attr('data-social-height') ? $thisLink.attr('data-social-height') : 450;
				Popup.open(this.href, width, height);
			}
		};

	}
);