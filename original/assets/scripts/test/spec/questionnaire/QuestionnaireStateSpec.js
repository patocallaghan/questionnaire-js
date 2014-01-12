define([

	'jquery',
	'pubsub'

], function($){

	describe('the Questionnaire State', function() {

		var expectedState = {
			stages: ['0', '1a', '1b', '2', '3', 'end'],
			current: '0',
			next: '1a',
			previous:'-1',
			progress: '0'
		};

		before(function(){
			preloadFixtures('questionnaire/questionnaire.html');
		});

		beforeEach(function(){
			loadFixtures('questionnaire/questionnaire.html');
		});

		afterEach(function(){
			$.unsubscribe('/questionnaire/state/ready');
			$.unsubscribe('/questionnaire/state/updated');
			requirejs.undef('app/ui/questionnaire/state');
		});

		describe('the state ready event', function(){

			it('fires a state ready event', function(done){
				var spy = sinon.spy();

				require(['app/ui/questionnaire/state'], function( State ) {
					StateModule = State;
					$.subscribe('/questionnaire/state/ready', spy);
					State.init();

					//Assertion
					expect(spy).to.be.called;
					done();
				} );

			});

		});

		describe('the state object', function(){
			it('correctly returns a state object', function(done){

				//Setup
				var state;
				var StateModule;

				//Work
				require(['app/ui/questionnaire/state'], function( State ) {
					StateModule = State;
					$.subscribe('/questionnaire/state/ready', assertion);
					State.init();
				} );

				function assertion ( e, data ){
					state = StateModule.getState();
					//Assertion
					expect(state).to.exist;
					done();
				}

			});

			it('creates the stages array correctly', function(done) {

				//Setup
				var state;
				var StateModule;

				//Work
				require(['app/ui/questionnaire/state'], function( State ) {
					StateModule = State;
					$.subscribe('/questionnaire/state/ready', assertion);
					State.init();
				} );

				function assertion(e, data){
					state = StateModule.getState();
					//Assertion
					expect(state.stages).to.eql(expectedState.stages);
					done();
				}

			});

			it('creates the current value correctly', function(done) {

				//Setup
				var state;
				var StateModule;

				//Work
				require(['app/ui/questionnaire/state'], function( State ) {
					StateModule = State;
					$.subscribe('/questionnaire/state/ready', assertion);
					State.init();
				} );

				function assertion(e, data){
					state = StateModule.getState();
					//Assertion
					expect(state.current).to.eql(expectedState.current);
					done();
				}

			});

			it('creates the next value correctly', function(done) {

				//Setup
				var state;
				var StateModule;

				//Work
				require(['app/ui/questionnaire/state'], function( State ) {
					StateModule = State;
					$.subscribe('/questionnaire/state/ready', assertion);
					State.init();
				} );

				function assertion(e, data){
					state = StateModule.getState();
					//Assertion
					expect(state.next).to.eql(expectedState.next);
					done();
				}

			});
			it('creates the progress value correctly', function(done) {

				//Setup
				var state;
				var StateModule;

				//Work
				require(['app/ui/questionnaire/state'], function( State ) {
					StateModule = State;
					$.subscribe('/questionnaire/state/ready', assertion);
					State.init();
				} );

				function assertion(e, data){
					state = StateModule.getState();
					//Assertion
					expect(state.progress).to.eql(expectedState.progress);
					done();
				}

			});
		});

		describe('the update state process', function(){

			describe('the update next state process', function(){

				it('should update the state object correctly when going next', function(done){

					//Setup
					var state;

					//Work
					require(['app/ui/questionnaire/state'], function( State ) {
						StateModule = State;
						$.subscribe('/questionnaire/state/ready', assertion);
						State.init();
					} );

					//Assertion
					function assertion(e, data){
						StateModule.setNext();
						state = StateModule.getState();
						//Assertion
						expect(state.current).to.equal('1a');
						expect(state.next).to.equal('1b');
						expect(state.previous).to.equal('0');
						expect(state.progress).to.equal('1a');
						done();
					}
				});

				it('shouldnt update the state object when you are at the end', function(done){

					//Setup
					var state;

					//Work
					require(['app/ui/questionnaire/state'], function( State ) {
						StateModule = State;
						$.subscribe('/questionnaire/state/ready', assertion);
						State.init();
					} );

					//Assertion
					function assertion(e, data){
						StateModule.setNext();
						StateModule.setNext();
						StateModule.setNext();
						StateModule.setNext();
						StateModule.setNext();
						StateModule.setNext();
						state = StateModule.getState();
						//Assertion
						expect(state.current).to.equal('end');
						expect(state.next).to.equal('-1');
						expect(state.previous).to.equal('3');
						expect(state.progress).to.equal('end');
						done();
					}
				});

			});

			describe('the update previous state process', function(){

				it('should update the state object correctly when going previous', function(done){

					//Setup
					var state;

					//Work
					require(['app/ui/questionnaire/state'], function( State ) {
						StateModule = State;
						$.subscribe('/questionnaire/state/ready', assertion);
						State.init();
					} );

					//Assertion
					function assertion(e, data){
						StateModule.setNext();
						StateModule.setNext();
						StateModule.setPrevious();
						state = StateModule.getState();

						//Assertion
						expect(state.current).to.equal('1a');
						expect(state.next).to.equal('1b');
						expect(state.previous).to.equal('0');
						done();
					}
				});

				it('shouldnt update the state object when you are at the end', function(done){

					//Setup
					var state;

					//Work
					require(['app/ui/questionnaire/state'], function( State ) {
						StateModule = State;
						$.subscribe('/questionnaire/state/ready', assertion);
						State.init();
					} );

					//Assertion
					function assertion(e, data){
						StateModule.setPrevious();
						state = StateModule.getState();
						//Assertion
						expect(state.current).to.equal('0');
						expect(state.next).to.equal('1a');
						expect(state.previous).to.equal('-1');
						done();
					}
				});
			});

			describe('the random update state process', function(){

				it('should randomly update the state object correctly when going in a previous direction', function(done){

					//Setup
					var state;

					//Work
					require(['app/ui/questionnaire/state'], function( State ) {
						StateModule = State;
						$.subscribe('/questionnaire/state/ready', assertion);
						State.init();
					} );

					//Assertion
					function assertion(e, data){
						StateModule.setNext();
						StateModule.setNext();
						StateModule.setState('1a');
						state = StateModule.getState();

						//Assertion
						expect(state.current).to.equal('1a');
						expect(state.next).to.equal('1b');
						expect(state.previous).to.equal('0');
						done();
					}
				});

				it('should randomly update the state object correctly when going in a previous direction', function(done){

					//Setup
					var state;

					//Work
					require(['app/ui/questionnaire/state'], function( State ) {
						StateModule = State;
						$.subscribe('/questionnaire/state/ready', assertion);
						State.init();
					} );

					//Assertion
					function assertion(e, data){
						StateModule.setNext();
						StateModule.setNext();
						StateModule.setNext();
						StateModule.setPrevious();
						StateModule.setState('2');
						state = StateModule.getState();

						//Assertion
						expect(state.current).to.equal('2');
						expect(state.next).to.equal('3');
						expect(state.previous).to.equal('1b');
						done();
					}
				});

				it('shouldnt randomly update the state object when you are at the end', function(done){

					//Setup
					var state;

					//Work
					require(['app/ui/questionnaire/state'], function( State ) {
						StateModule = State;
						$.subscribe('/questionnaire/state/ready', assertion);
						State.init();
					} );

					//Assertion
					function assertion(e, data){
						StateModule.setNext();
						StateModule.setNext();
						StateModule.setNext();
						StateModule.setNext();
						StateModule.setNext();
						StateModule.setState('1a');
						state = StateModule.getState();
						//Assertion
						expect(state.current).to.equal('1a');
						expect(state.next).to.equal('1b');
						expect(state.previous).to.equal('0');
						done();
					}
				});

			});
		});

	});

});

