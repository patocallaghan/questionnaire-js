/*

					   ______
					 <((((((\\\
					 /      . }\
					 ;--..--._|}
  (\                 '--/\--'  )
   \\                | '-'  :'|
	\\               . -==- .-|
	 \\               \.__.'   \--._
	 [\\          __.--|       //  _/'--.
	 \ \\       .'-._ ('-----'/ __/      \
	  \ \\     /   __>|      | '--.       |
	   \ \\   |   \   |     /    /       /
		\ '\ /     \  |     |  _/       /
		 \  \       \ |     | /        /
   snd    \  \      \        /				http://ascii.co.uk/art/terminator

* PRINTERNATOR - jQuery plugin to Print pages
* Original author: @patocallaghan
* Licensed under the MIT license

Useage: 	$('.print').printernator();
			$('.print').printernator({
				delegate : '.parent-element'
			});
*/
;(function($, window, document, undefined) {

	function printPage(e) {
		e.preventDefault();
		window.print();
	}

	$.fn.printernator = function(options) {
		
		var defaults = {
			delegate: ''
		};
		
		this.options = $.extend({}, defaults, options);
		
		if(this.options.delegate.length) {
			return $(this.options.delegate).on('click', this, printPage);
		}
		
		return this.on('click', printPage);
	};
	
})(jQuery, window, document);