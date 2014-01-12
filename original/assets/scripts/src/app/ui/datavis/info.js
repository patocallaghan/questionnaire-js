define( [

		'jquery'

	], function ( $ ) {

	'use strict';

	var $ind;
	var $helpPanel;

	return {
		init: function () {
			$ind = $('.js-map-key-info-ind');
			$helpPanel = $('.js-map-info-text');
			this._initEvents();
		},
		_initEvents: function(){
			if( $('.touch').length ) {
				$ind.on('click', this._openHelp);
			}
		},
		_openHelp: function(){
			var action = $helpPanel.is('.is-visible') ? 'removeClass' : 'addClass';
			$helpPanel[action]('is-visible');
		}
	};

} );

