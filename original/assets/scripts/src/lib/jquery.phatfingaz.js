/*!
* Phat Fingaz plugin
* Original author: @patocallaghan
* Based on jQuery boilerplate plugin by @addyosmani
* Licensed under the MIT license
*/

;
(function($, window, document, undefined) {

	'use strict';

	// Create the defaults once
	var pluginName = 'phatFingaz',
	    defaults = {
	    	callback: null
	    };

	// The actual plugin constructor

	function Plugin(element, options) {
		this.element = element;
		this.options = $.extend({ }, defaults, options);

		this._defaults = defaults;
		this._name = pluginName;
		this.link = this.setLink();
		
		if(this.link === null) {
			//stop processing items with no link
			return;
		} 
		
		this.url = this.setUrl();
		this.inNewWindow = this.setNewWindow();

		this.init();
	}

	Plugin.prototype = {
		init: function() {
			if($(this.element).find('a[href]')) {
				$(this.element).on('click', {$plugin: this}, this.processClick);
			}
		},
		processClick: function(e) {
			e.preventDefault();
			var $plugin = e.data.$plugin;
			if($plugin.options.callback) {
				$plugin.options.callback.call(this);
			} else {
				$plugin.openLink($plugin.url, $plugin.inNewWindow);
			}
			
		},
		openLink: function(url, newWindow) {
			window.open(url, newWindow);
		},
		setLink: function( ) {
			return $(this.element).find('a[href]').first()[0] || null;
		},
		setUrl: function( ) {
			return this.link.href;
		},
		setNewWindow: function() {
			if ( this.link.target === '_blank') {
				return '_blank';
			}
			return '_self';
		}
	};

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName,
					new Plugin(this, options));
			}
		});
	};

})(jQuery, window, document);