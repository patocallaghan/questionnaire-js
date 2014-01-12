/* app/ui/print/all */

define(
	[
		'jquery',
	],

	function ( $ ) {

		var PrintAll;
		var printWindow;
		var printUrl;

		return {

			init: function () {
				PrintAll = this;
				printUrl = PrintAll._getPrintUrl();

				PrintAll._bindEvents();
			},
			_bindEvents: function () {
				$('body').on('click', '.js-print-all', PrintAll._processClick);
			},
			_processClick: function (e) {
				printWindow = window.open(printUrl, 'printWindow');

				$(printWindow).on('load', PrintAll._print);
				return false;
			},
			_print: function () {
				printWindow.print();
			},
			_getPrintUrl: function () {
				var path = location.href.match(/[^?]*/)[0];
				var query = location.href.match(/\?(.*)/);
				var url = path + (path[path.length-1] === '/' ? '' : '/') + 'PrintList' + (query ? query[0] : '');

				return url;
			}

		};

	}
);
