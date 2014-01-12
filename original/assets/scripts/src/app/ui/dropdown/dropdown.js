/* app/ui/dropdown/dropdown */

define(
	[
		'jquery'
	],

	function ($) {

		var Dropdown;
		var $dropdowns;

		return {

			init: function () {
				Dropdown = this;
				$dropdowns = $('.js-edition-dropdown');

				$('body').on('click', this._hideVisibleDropdowns);
				$(window).resize($.throttle(250, this._resizePosition));
			},

			_hideVisibleDropdowns: function (event) {
				var $eventTarget = $(event.target);
				var $dropdownsVisible = $dropdowns.filter('.is-visible');
				$dropdownsVisible.length && $dropdownsVisible.removeClass('is-visible');
				if ($eventTarget.hasClass('js-dropdown-selector')) {
					event.preventDefault();
					Dropdown._showDropdown($eventTarget);
				}
			},

			_resizePosition: function () {
				var $visibleDropdown = $dropdowns.filter('.is-visible').first();

				if ($visibleDropdown.length) {
					var dropdownId = $visibleDropdown.attr("id");
					var $dropdownLink = $('.js-dropdown-selector').filter('[href="#' + dropdownId + '"]');
					if ($dropdownLink.length) {
						Dropdown._showDropdown($dropdownLink);
					}
				}
			},

			_showDropdown: function ($link) {
				var dropdownId = $link.attr('href');
				var thisLinkPos = $link.offset();
				var $dropdown = $(dropdownId);
				console.log(thisLinkPos);
				$dropdown.css({ left: thisLinkPos.left - 50, top: thisLinkPos.top })
					.addClass("is-visible");
			}

		};

	}
);