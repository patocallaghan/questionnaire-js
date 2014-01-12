/* app/ui/nav/small */

define( 
	[
		'jquery'
	],

	function ( $ ) {

		var NavSmall;
		var $nav;
		var $navItems;
		var $navItemsLink;
		var $navToggle;
		var $search;
		var $searchToggle;

		return {

			init: function () {
				NavSmall = this;
				function atomicNav() {
					if ( !$( '#js-nav-primary' ).data( 'nav' ) ) {
						NavSmall.initVars();
						NavSmall.bind();
					} else {
						setTimeout( atomicNav, 50 );
					}
				}
				atomicNav();
			},
			initVars: function () {
				if ( typeof $nav === 'undefined' ) {
					NavSmall = this;
					$nav = $( '#js-nav-primary' );
					$navItems = $nav.find( '.js-nav-section-with-menu' );
					$navItemsLink = $nav.find( '.js-nav-primary-link' );
					$navToggle = $( '.js-header-menu-toggle' );
					$search = $( '#header-search-container' );
					$searchToggle = $( '.js-header-search-toggle' );
				}
			},

			bind: function () {
				this._setData();
				$navToggle.on( 'click', this._toggleSmallMenu );
				$navItemsLink.on( 'click', this._openSubMenuLink );
				$navItems.on( 'click', this._openSubMenu );
				$searchToggle.on( 'click', this._toggleSmallSearch );
			},

			unbind: function () {
				$navToggle.off( 'click', this._toggleSmallMenu );
				$navItemsLink.off( 'click', this._openSubMenuLink );
				$navItems.off( 'click', this._openSubMenu );
				$searchToggle.off( 'click', this._toggleSmallSearch );
				this._removeData();
			},

			_toggleSmallMenu: function ( event ) {
				event.preventDefault();

				// close site search if open
				if ( $search.is( '.is-expanded' ) ) {
					$searchToggle.trigger( 'click' );
				}

				// show/hide primary nav menu dependant on current state
				$nav.toggleClass( 'is-expanded is-collapsed' );
				// toggle class on menu button (adds padding and swaps bg color)
				$navToggle.toggleClass( 'is-expanded' );

				if ( $nav.is( '.is-collapsed' ) ) {
					$nav.find( '.is-selected' ).removeClass( 'is-selected' );
				}
			},

			_toggleSmallSearch: function ( event ) {
				event.preventDefault();

				// close primary nav menu if open
				if ( $navToggle.is( '.is-expanded' ) ) {
					$navToggle.trigger( 'click' );
				}

				// show/hide site search dependant on current state
				$search.toggleClass( 'is-expanded' );
				// toggle class on search button (adds padding and swaps bg color)
				$searchToggle.toggleClass( 'is-expanded' );
			},

			_openSubMenu: function ( event ) {
				var $item = $( this );
				if ( !$item.is( '.is-selected' ) ) {
					$nav.children( '.is-selected' ).removeClass( 'is-selected' );
				}
				$item.toggleClass( 'is-selected' );
			},

			_openSubMenuLink: function ( event ) {
				$navItems.off( 'click', this._openSubMenu );
			},

			_setData: function () {
				$nav.data( 'nav', 'true' );
			},

			_removeData: function () {
				$nav.removeData( 'nav' );
			}
		};

	}
);