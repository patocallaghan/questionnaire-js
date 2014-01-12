define([

	'jquery',
	'app/ui/questionnaire/flow',
	'pubsub'

], function( $, Flow ){

	var mockState = {
		stages: ['0', '1a', '1b', '2', '3', 'end'],
		current: '1b',
		next: '2',
		previous:'1a',
		progress: '1b'
	};

	xdescribe('the main questionnaire content flow', function(){

		var $startScreen;
		var $introduction;
		var $status;
		var $main;
		var $summary;
		var $steps;
		var $firstSection;

		before(function(){
			preloadFixtures('questionnaire/questionnaire.html');
		});

		beforeEach(function(){
			loadFixtures('questionnaire/questionnaire.html');
			$introduction = $('#js-questionnaire-introduction');
			$startScreen = $('#js-questionnaire-begin');
			$status = $('#js-questionnaire-status');
			$main = $('#js-questionnaire-main');
			$summary = $('#js-questionnaire-end');
			$stages = $main.find('.js-questionnaire-stage');
			$steps = $main.find('.js-questionnaire-section');
			$firstSection = $stages.eq(0);
			$firstStep = $steps.eq(0);
			Flow.init();
		});

		afterEach(function(){
			requirejs.undef('app/ui/questionnaire/state');
		});

		describe('the flow options', function(){

			it('should fire an unlock event if an option is clicked', function(){

				//Setup
				var spy = sinon.spy();
				var $firstOption = $steps.find('.js-questionnaire-question-list').eq(0).find('.js-input-toggle');

				//Work
				$.subscribe('/questionnaire/controls/unlock', spy);
				$firstOption.trigger('click');

				//Assertion
				expect(spy).to.have.been.called;

			});

			it('should place the correct content inside the tooltip', function(){

				//Setup
				var $tooltipContent;
				var $tooltip = $( '.js-questionnaire-toggle-answer' );
				var $firstOption = $steps.find('.js-questionnaire-question-list').eq(0).find('.js-input-toggle').eq(0);

				//Work
				$firstOption.trigger('click');
				$tooltipContent = $tooltip.children();

				//Assertion
				expect($tooltipContent.length).to.be.at.least(1);

			});

		});

		describe('the start screen', function(){

			xit('should correctly start the questionnaire flow after the start has been clicked', function(){

				//Setup
				var $firstSection = $main.find('.js-questionnaire-stage').eq(0)
					.find('.js-questionnaire-section').eq(0);

				//Work
				$startScreen.trigger('click');

				//Assertion
				expect($startScreen).to.not.have.class('is-visible');
				expect($introduction).to.not.have.class('is-visible');
				expect($status).to.have.class('is-visible');
				expect($main).to.have.class('is-visible');
				expect($firstSection).to.have.class('is-visible');
				expect($firstStep).to.have.class('is-visible');
			});

			xit('should correctly re-show the start screen if it is re-shown', function(){

				//Setup

				//Work
				$startScreen.trigger('click');

				//Assertion
				expect($startScreen).to.have.class('is-visible');
				expect($introduction).to.have.class('is-visible');
				expect($status).to.not.have.class('is-visible');
				expect($main).to.not.have.class('is-visible');
			});
		});

		describe( 'the flow steps', function(){

			it('should change the next step correctly', function(){

				//Setup
				var $currentStep = $steps.filter(function(){
					return $(this).attr('data-step') === '1a'
				});
				var $nextStep = $steps.filter(function(){
					return $(this).attr('data-step') === '1b'
				});

				//Work
				$startScreen.trigger( 'click' );
				$.publish( '/questionnaire/step/change', [{
					step: '1b'
				}] );

				//Assertion
				expect($currentStep).to.not.have.class( 'is-visible' );
				expect($nextStep).to.have.class( 'is-visible' );
			});

			it('should correctly show the start screen at the first stage', function(){

				//Setup
				var $currentStep = $steps.filter(function(){
					return $(this).attr('data-step') === '1a'
				});

				//Work
				$startScreen.trigger( 'click' );
				$.publish( '/questionnaire/step/change', [{
					step: '0'
				}] );

				//Assertion
				expect($currentStep).to.not.have.class( 'is-visible' );
				expect($stages).to.not.have.class( 'is-visible' );
				expect($startScreen).to.have.class( 'is-visible' );
			});

			it('should correctly show the summary screen at the last stage', function(){

				//Setup
				var $currentStep = $steps.filter(function(){
					return $(this).attr('data-step') === '3'
				});

				//Work
				$startScreen.trigger( 'click' );
				$.publish( '/questionnaire/step/change', [{
					step: 'end'
				}] );

				//Assertion
				expect($currentStep).to.not.have.class( 'is-visible' );
				expect($summary).to.have.class( 'is-visible' );
			});
		} );
	});
});

