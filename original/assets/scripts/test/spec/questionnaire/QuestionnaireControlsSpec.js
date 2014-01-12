define([

	'jquery',
	'app/ui/questionnaire/controls',
	'pubsub'

], function( $, Controls ){

	xdescribe('the questionnaire controls', function(){

		var $next;
		var $previous;

		function getStep ( data ) {
			return data.step;
		}

		before(function(){
			preloadFixtures('questionnaire/questionnaire.html');
		});

		beforeEach(function(){
			loadFixtures('questionnaire/questionnaire.html');
		});

		afterEach(function(){
			requirejs.undef('app/ui/questionnaire/state');
		});

		describe('the controls', function(){

			it('should unlock the controls correctly', function(){
				//Setup

				//Work
				Controls.init();
				$.publish( '/questionnaire/flow/changed' );
				$next = $('.js-next');
				$previous = $('.js-previous');

				//Assertion
				expect($next).to.have.class('is-unlocked');
			});


			xit('should not unlock the controls if the flow has not progressed far enough', function(){
				//Setup

				//Work
				Controls.init();
				$.publish( '/questionnaire/flow/changed' );
				$next = $('.js-next');
				$previous = $('.js-previous');

				//Assertion
				expect($next).to.not.have.class('is-unlocked');
			});

			it('should unlock the next stage on the unlock event', function(){
				//Setup
				$next = $('.js-next');

				//Work
				Controls.init();
				$.publish('/questionnaire/controls/unlock');

				//Assertion
				expect($next).to.have.class('is-unlocked');
			});

			describe( 'the click events', function(){

				xit('should send a change event when the buttons are clicked', function(){

					//Setup
					var spy = sinon.spy();
					$next = $('.js-next');
					$previous = $('.js-previous');

					//Work
					Controls.init();
					$.publish('/questionnaire/controls/unlock');
					$.subscribe('/questionnaire/step/change', spy);
					$next.trigger('click');
					$previous.trigger('click');

					//Assertion
					expect(spy).to.have.been.calledTwice;
				});

				xit('should not fire a change event if the next stage isnt unlocked', function(){

					//Setup
					var spy = sinon.spy();
					$next = $('.js-next');

					//Work
					Controls.init();
					$.subscribe('/questionnaire/step/change', spy);
					$next.trigger( 'click' );

					//Assertion
					expect( spy ).to.not.have.been.called;
				});

				xit('should send a change event with the correct data when the buttons are clicked', function( done ){

					//Setup
					var step;
					var expectedData = '1a';
					var spy = sinon.spy();
					$next = $('.js-next');
					$previous = $('.js-previous');

					//Work
					require( ['app/ui/questionnaire/state'], function( State ){
						State.init();
						Controls.init();
						$.subscribe('/questionnaire/step/change', function( data ){
							step = getStep( data );
							//Assertion
							expect( step ).to.equal( expectedData );
							done();
						});
						$next.trigger('click');
						$previous.trigger('click');

					} );
				});

			} );
		});
	});
});


