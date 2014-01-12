define([

	'jquery',
	'app/ui/questionnaire/menu',
	'pubsub'

], function( $, Menu, State ){

	var mockState = {
		stages: ['0', '1a', '1b', '2', '3', 'end'],
		current: '1b',
		next: '2',
		previous:'1a',
		progress: '1b'
	};

	xdescribe('the questionnaire menu', function(){

		before(function(){
			preloadFixtures('questionnaire/questionnaire.html');
		});

		beforeEach(function(){
			loadFixtures('questionnaire/questionnaire.html');
		});

		afterEach(function(){
			requirejs.undef('app/ui/questionnaire/state');
		});

		xdescribe('the menu events', function(){

			afterEach(function(){
			});

			it('should fire a change event when clicked', function(done){
				var spy;
				var $menuItem;

				//Work
				spy = sinon.spy();
				Menu.init();
				require(['app/ui/questionnaire/state'], function(State){
					State.init();
					State.setNext();
					$.subscribe('/questionnaire/step/change', spy);
					$menuItem = $('.js-menu-step').eq(1);
					$menuItem.trigger('click');

					//Assertion
					expect(spy).to.have.been.called;
					done();
				});
			});

			it('should not fire an event when the questionnaire has not progressed to a clicked item', function(done){
				//Setup
				var $menuItem;
				spy = sinon.spy();

				//Work
				Menu.init();
				require(['app/ui/questionnaire/state'], function(State){
					State.init();
					$.subscribe('/questionnaire/step/change', spy);
					State.setNext();
					State.setNext();
					State.setNext();
					$menuItem = $('.js-menu-step').eq(1);

					//Assertion
					$menuItem.trigger('click');
					expect(spy).to.not.have.been.called;
					done();
				});
			});

		});

		describe('the menu state', function(){

			it('should set the current clicked item to .is-selected', function(){
				//Setup
				var $menuItem;
				Menu.init();

				//Work
				$menuItem = $('.js-menu-step').eq(0);
				$menuItem.trigger('click');

				expect($menuItem).to.have.class('is-selected');
			});

			it('should unlock a new step once its been progressed to', function(){
				//Setup
				var $menuItem;
				Menu.init();

				//Work
				$menuItem = $('.js-menu-step').eq(0);
				$.publish('/questionnaire/menu/unlock', [{
					step: '1a'
				}]);

				//Assertion
				expect($menuItem).to.have.class('is-completed');
			});

		});
	});
});
