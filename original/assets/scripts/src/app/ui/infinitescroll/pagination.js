/* app/ui/infinitescroll/pagination */

define( 
	[
		'jquery',
		'app/ui/infinitescroll/pagination',
		'pubsub'
	],

	function ( $, Pagination ) {

		var Pagination;
		var $pagination;
		var $pages;

		return {

			init: function () {
				Pagination = this;
				this._getPagination();
				this._initSubscriptions();
				this._setupAjaxUrls();
			},

			_initSubscriptions: function () {
				$.subscribe( '/pagination/next', $.proxy( this._processNext, this ) );
				$.subscribe( '/pagination/update', $.proxy( this._processUpdate, this ) );
			},

			_processUpdate: function ( data ) {
				this._getPagination();
				this._updateValues( data );
				this._updateSelected();
				this._updatePageNumber();
				this._insertPagination();
			},

			_processNext: function () {
				var url = this._getNextPageUrl();
				var hasMore = this._hasMoreResults();
				var data = {
					url: url,
					hasMore: hasMore
				};
				this._publishUrlEvent( data );
			},

			_getPagination: function () {
				if ( !$pagination ) {
					$pagination = $( '.js-pagination' );
					return $pagination;
				}
				return $pagination;
			},

			_getPages: function () {
				if ( !$pages ) {
					$pages = $pagination.find( '.js-pagination-pages' );
					return $pages;
				}
				return $pages;
			},

			_updateValues: function ( data ) {
				$pagination.find( '.js-pagination-start' ).text( data.start );
				$pagination.find( '.js-pagination-end' ).text( data.end );
			},

			_insertPagination: function () {
				$( '.js-listing-infinite' ).last().after( $pagination );
			},

			_getNextPageUrl: function () {
				var $firstPages = $( '.js-pagination-pages' ).eq( 0 );
				var $selected = $firstPages.find( '.is-selected' );
				var nextPage = $selected.closest( 'li' ).next( 'li' ).find( '.js-page' )[0];

				return nextPage != undefined ? nextPage.href : -1;
			},

			_hasMoreResults: function () {
				var $firstPages = $( '.js-pagination-pages' ).eq( 0 );
				var $nextItem = $firstPages.find( '.is-selected' ).closest( 'li' ).next().next().filter( function () {

					if ( $( this ).find( '.js-page' ).length ) {
						return true;
					}

					return false;

				} );
				return !!$nextItem.length;
			},

			_getPageSize: function () {
				var url = $pagination.find( '.js-pagination-pages' ).attr( 'data-url' );
				var pageSizeString = url.substring( url.lastIndexOf( '/' ), url.length );
				return parseInt( /\d+/.exec( pageSizeString )[0], 10 );
			},

			_getPageNumberFromUrl: function ( href ) {
				var matches = /PageNumber=\d+/.exec( href );
				if ( !matches ) {
					matches = /page=\d+/.exec( href );
				}
				if ( !matches ) {
					return 1;
				}
				return /\d+/.exec( matches[0] )[0];
			},

			_getNextStartingPoint: function ( pageNumber ) {
				return ( pageNumber * this._getPageSize() ) - this._getPageSize() + 1;
			},

			_getNewUrl: function ( oldUrl ) {
				var ajaxUrl = $pagination.find( '.js-pagination-pages' ).attr( 'data-url' );
				var queryIndex = oldUrl.indexOf( '?' );
				var queryString = queryIndex > -1 ? oldUrl.substring( queryIndex, oldUrl.length ) : '';
				var urlWithoutQuery = queryIndex > -1 ? oldUrl.substring( 0, queryIndex ) : oldUrl;
				var urlWithoutTrailingSlash = urlWithoutQuery.substring( urlWithoutQuery.length - 1 ) === '/' ? urlWithoutQuery.substring( 0, urlWithoutQuery.length - 1 ) : urlWithoutQuery;
				return urlWithoutTrailingSlash + ajaxUrl + queryString;
			},

			_setupAjaxUrls: function () {
				var $firstPages = this._getPages();
				$firstPages.each( function () {
					$( this ).find( '.js-page' ).each( function () {
						var $thisLink = $( this );
						$thisLink.attr( 'href', Pagination._getNewUrl( $thisLink.attr( 'href' ) ) );
					} );
				} );
			},

			_updateSelected: function () {
				var $selected;
				var $nextPage;
				var $pagesCopy = this._getPages();

				$pagesCopy.each( function () {
					var $thisPages = $( this );
					$selected = $thisPages.find( '.is-selected' );
					$nextPage = $selected.closest( 'li' ).next( 'li' );
					$selected.removeClass( 'is-selected' );
					$nextPage.find( '.js-page' ).addClass( 'is-selected' );
				} );

				return $nextPage.find( '.js-page' );
			},

			_publishUrlEvent: function ( data ) {
				$.publish( '/pagination/url', [data] );
			},

			_updatePageNumber: function () {
				var $firstPages = $( '.js-pagination-pages' ).eq( 0 );
				var $items = $firstPages.find( 'li' );
				var $selectedItem = $firstPages.find( '.is-selected' ).closest( 'li' );
				var newPage = parseInt( $items.index( $selectedItem ), 10 ) + 1;

				$pagination.find( '.js-pagination-page-number' ).text( newPage );
				$pagination.find( '.js-pagination-page-number' ).closest( ".js-pagination" ).addClass( 'hidden' );
			}

		};

	}
);