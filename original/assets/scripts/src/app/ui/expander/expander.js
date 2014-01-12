/* app/ui/expander/expander */

define(
	[
		'jquery',
		'expandcollapse'
	],

	function ( $ ) {

		var Expander;
		var $expanders;
		var $expandCollapseAll;

		return {

			init: function () {
				Expander = this;
				$expanders = $('.js-expand-collapse');
				$expandCollapseAll = $('.js-expand-collapse-all');
				$('.js-expand-collapse').expandCollapse({
					disabledClass: 'is-disabled'
				});
				this._initEvents();
			},

			_initEvents: function () {
				$('.js-expand-collapse-all').on('click', { $obj: this }, this._processAllEvent);
				$expanders.on('expandcollapse.clicked', { $obj: this }, this._processHeaderClick);
				$expanders.on('expandcollapse.clicked', { $obj: this }, this._checkExpandedStatus);
			},

			_processAllEvent: function (event) {

				event.preventDefault();
				var eventToTrigger;
				var $thisButton = $(this);
				var $obj = event.data.$obj;
				
				eventToTrigger = $thisButton.is('.is-expanded') ? 'expandcollapse.close' : 'expandcollapse.open';
				$obj._triggerExpanderEvents(eventToTrigger);
			},

			_processHeaderClick: function () {
				var $thisHeader = $(this);
				if( !$thisHeader.is( '.is-disabled' ) ) {
					if (Modernizr.csstransitions) {
						return;
					}
					$thisHeader.find('.js-icon').toggleClass('icof-arrowdown icof-arrowup');
				}
			},

			_checkExpandedStatus: function () {
				var $thisExpander = $(this).closest('li');
				var $openExpanders = $expanders.filter('.is-expanded').length;

				if ($thisExpander.hasClass('is-collapsed') && ($expanders.length - $openExpanders) === 1) {
					Expander._updateButton($expandCollapseAll);
				}
				if ($thisExpander.hasClass('is-expanded') && ($expanders.length === $openExpanders)) {
					Expander._updateButton($expandCollapseAll);
				}
			},

			_updateButton: function ($thisButton) {
				var buttonText;
				$thisButton.toggleClass('is-expanded is-collapsed');
				$thisButton.find('.icof-plus, .icof-minus').toggleClass('icof-plus icof-minus');
				buttonText = $thisButton.is('.is-expanded') ? 'Close all' : 'Open all';
				$thisButton.find('.js-expand-collapse-text').text(buttonText);
			},

			_triggerExpanderEvents: function (eventToTrigger) {
				$expanders.each(function () {
					var $thisExpander = $(this);
					if (!($thisExpander.is('.is-expanded') && eventToTrigger === 'expandcollapse.open') && !($thisExpander.is('.is-collapsed') && eventToTrigger === 'expandcollapse.close')) {
						$thisExpander.trigger(eventToTrigger);
					}
				});
			}

		};

	}
);
