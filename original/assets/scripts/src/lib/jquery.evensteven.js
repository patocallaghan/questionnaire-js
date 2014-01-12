/*!
* jQuery lightweight plugin boilerplate
* Original author: @ajpiano
* Further changes, comments: @addyosmani
* Licensed under the MIT license
*/

; (function ($, window, document, undefined) {


	// Create the defaults once
	var pluginName = 'evenSteven',
		defaults = {
			outerHeight: false,
			columns : 0,
			selector: "",
			resize: false
		};

	// The actual plugin constructor
	function EvenSteven(element, options) {
		this.pluginName = pluginName;
		this.element = element;

		this.options = $.extend({}, defaults, options);
		this._heightCalc = this.options.outerHeight ? "outerHeight" : "height";
		this._tallest = 0;
		this._defaults = defaults;
		this._name = pluginName;
		this._elems = [];
		
		this.init();
	}

	EvenSteven.prototype.init = function () {
		
		this.retrieveNodes();
		this.runCalculations();

		if(this.options.resize) {
			this.initResizeEvent();
			this.initTriggers();
		}

	};

	EvenSteven.prototype.runCalculations = function() {
		if(!this.options.columns) {
			this.setAllHeights();
		} else {
			this.setColumnHeights();
		}
	};

	EvenSteven.prototype.retrieveNodes = function() {
		var elemStore = this._elems;
		$(this.element).each(function() {
			elemStore.push($(this));
		});
	};
	
	EvenSteven.prototype.setAllHeights = function() {
		this.calculateHeights();
		this.setHeights();
	};

	EvenSteven.prototype.setColumnHeights = function() {
		for (var i = 0, length = this._elems.length; i < length; i += this.options.columns) {
			this.calculateHeights(i);
			this.setHeights(i);
		}
	};
	
	EvenSteven.prototype.setHeights = function(currentCount) {
		var i = currentCount != null ? currentCount : 0,
			length = currentCount != null ? currentCount + this.options.columns : this._elems.length;
		for(; i < length; i++) {
			var current = this._elems[i];
			if(!current) return;
			this._elems[i].height(this._tallest);
		}
	};
	
	EvenSteven.prototype.calculateHeights = function(currentCount) {
		this._tallest = 0;
		var i = currentCount != null ? currentCount : 0,
			length = currentCount != null ? currentCount + this.options.columns : this._elems.length;
		for(; i < length; i++) {
			var current = this._elems[i];
			if(!current) return;
			var currentHeight = current[this._heightCalc]();
			currentHeight > this._tallest && (this._tallest = currentHeight);
		}
	};

	EvenSteven.prototype.resetHeights = function() {
		for(var i = 0, length = this._elems.length; i < length; i++) {
			var current = this._elems[i];
			if(!current) return;
			current.css('height', '');
		}
	};

	EvenSteven.prototype.update = function(updatedOptions) {
		if(updatedOptions) {
			this.options = $.extend({}, this.options, updatedOptions);
		}
		this.resetHeights();
		this.runCalculations();
	};
	
	/* Resize Event Handlers */
	EvenSteven.prototype.runResizeEvent = function(e) {
		if(!e || !e.data || !e.data.plugin || e.data.plugin.pluginName !== 'evenSteven') {
			return;
		}
		e.data.plugin.update();
	};

	EvenSteven.prototype.initResizeEvent = function() {
		$(window).on('resize', {plugin: this}, $.throttle(250, this.runResizeEvent));
	};
	
	EvenSteven.prototype.removeResizeEvent = function() {
		$(window).off('resize', this.runResizeEvent);
	};
	
	/* Init Triggers */
	EvenSteven.prototype.initTriggers = function() {
		/* Triggers to turn on/off resize events */
		$(this).on('on.resize.evensteven', this.initResizeEvent);
		$(this).on('off.resize.evensteven', this.removeResizeEvent);
	};

	/* Turn of Triggers */
	EvenSteven.prototype.removeTriggers = function() {
		$(this).off('on.resize.evensteven', this.initResizeEvent);
		$(this).off('off.resize.evensteven', this.removeResizeEvent);
	};

	/* Destroy Plugin Methods */
	EvenSteven.prototype.removeData = function() {
		$(this.element).removeData( 'plugin_' + pluginName );
	};

	EvenSteven.prototype.destroy = function() {
		this.removeTriggers();
		this.removeResizeEvent();
		this.resetHeights();
		this.removeData();
	};

	/* Create the plugin */
	$.fn[pluginName] = function(options) {

		var plugin;
		
		if(options === 'destroy') {
			plugin = $(this).data('plugin_' + pluginName);
			if(!plugin) {
				return;
			}
			plugin.destroy();
			return;
		}
		
		if (!$.data(this, 'plugin_' + pluginName)) {
			plugin = new EvenSteven(this, options);
			$(this).data('plugin_' + pluginName, plugin);
		}
		
		return plugin;
	};

})(jQuery, window, document);