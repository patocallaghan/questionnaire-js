/* app/ui/nav/large */

define(
	[
		'jquery'
	],

	function ($) {

		var NavLarge;
		var $nav;
		var $navWithMenus;
		var $search;
		var $searchToggle;
		var $stickyNav;
		var navTopPos;

		return {
			init: function () {
				NavLarge = this;
				function atomicNav() {
					if (!$('#js-nav-primary').data('nav')) {
						NavLarge.initVars();
						NavLarge.bind();
					} else {
						setTimeout(atomicNav, 50);
					}
				}
				atomicNav();
				NavLarge.stickyNavInit();
			},

			initVars: function () {
				$nav = $('#js-nav-primary');
				$navWithMenus = $nav.find('.js-nav-section-with-menu');
				$search = $('#header-search-container');
				$searchToggle = $('.js-header-search-toggle');
				$stickyNav = $('.header-top');
				$stickyNavBumper = $('.header');
				navHeight = $stickyNav.outerHeight(true);
				navTopPos = $stickyNav.offset().top;
			},

			bind: function () {

				this._setData();
				$searchToggle.on('click', this._toggleMidSearch);

				//Using hover if "touch" device. Some caveats with this as it is really only WebKit devices. See https://github.com/Modernizr/Modernizr/issues/548 and https://github.com/Modernizr/Modernizr/issues/753
				require(['hoverIntent'], function ($) {
					if ($('.no-touch').length) {
						$navWithMenus.hoverIntent({
							over: NavLarge._toggleMegaMenuHover,
							out: NavLarge._toggleMegaMenuHover,
							interval: 30
						});
					}
				});

				if ($('.no-touch').length) {
					return;
				}

				this._bindTouchEvents();

			},

			stickyNavInit: function () {
				$(window).scroll(NavLarge._stickyNav);
				$(window).scroll();
			},

			_stickyNav: function () {
				var scrollTop = $(window).scrollTop();
				var wasSticky = $stickyNav.hasClass('header-sticky');
				var isSticky = scrollTop > navTopPos;
				var stickyAction;
				var bumperMargin;

				if (wasSticky === isSticky)
				{
					return;
				}

				stickyAction = isSticky ? "addClass" : "removeClass";
				bumperMargin = parseInt($stickyNavBumper.css('margin-bottom'), 10) + (isSticky ? navHeight : -navHeight);

				$stickyNav[stickyAction]('header-sticky');
				$stickyNavBumper.css('margin-bottom', bumperMargin);
			},

			_toggleMegaMenu: function (target, click, event) {
				if (click === 'click') {
					event.preventDefault();
				}
				var $thisTarget = $(target);
				var $thisNav = $thisTarget.is('.js-nav-section-with-menu') ? $thisTarget : $thisTarget.closest('.js-nav-section-with-menu');
				var $expanded = $nav.find('.is-expanded');

				if (click && click === 'click' && $expanded.find('.js-nav-primary-link')[0] !== target) {
					$expanded.removeClass('is-expanded');
				}

				$thisNav.toggleClass('is-expanded');

			},

			unbind: function () {
				$searchToggle.off('click', this._toggleMidSearch);
				$navWithMenus.unbind("click", this._toggleMegaMenu);
				$navWithMenus.unbind("mouseenter").unbind("mouseleave");
				$navWithMenus.removeProp('hoverIntent_t');
				$navWithMenus.removeProp('hoverIntent_s');
				this._removeData();
			},

			_toggleMidSearch: function (event) {
				event.preventDefault();

				// close primary nav menu if open
				/*if ($navToggle.is('.is-expanded')) {
				$navToggle.trigger('click');
				}*/

				// show/hide site search dependant on current state
				$search.toggleClass('is-expanded');
				// toggle class on search button (adds padding and swaps bg color)
				$searchToggle.toggleClass('is-expanded');
			},

			_toggleMegaMenuHover: function () {
				NavLarge._toggleMegaMenu(this);
			},

			_toggleMegaMenuClick: function (event) {
				NavLarge._toggleMegaMenu(this, 'click', event);
			},

			_bindTouchEvents: function () {
				$navWithMenus.each(function () {
					$(this).find('.js-nav-primary-link').on('click', NavLarge._toggleMegaMenuClick);
				});
				$('body').on('click', NavLarge._handleBodyClick);
			},

			_handleBodyClick: function (e) {
				var $target = $(e.target);
				if (!$target.closest('#js-nav-primary').length && $nav.find('.is-expanded').length) {
					$nav.find('.is-expanded').removeClass('is-expanded');
				}
			},

			_setData: function () {
				$nav.data('nav', 'true');
			},

			_removeData: function () {
				$nav.removeData('nav');
			}

		};

	}
);