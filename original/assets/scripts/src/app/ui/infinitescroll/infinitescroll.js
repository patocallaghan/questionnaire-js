/* app/ui/infinitescroll/infinitescroll */

define(
	[
		'jquery',
		'app/ui/infinitescroll/button',
		'app/ui/infinitescroll/pagination',
		'app/ui/infinitescroll/content',
		'util/ajax'
	],

	function ( $, Button, Pagination, Content, Ajax ) {

		'use strict';

		return {
			init: function () {
				Pagination.init();
				Content.init();
				Button.init();
				Ajax.init();
			},
			unbind: function () {

			}
		};
	}
);