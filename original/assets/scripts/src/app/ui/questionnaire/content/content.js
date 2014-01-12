/* app/ui/questionnaire/content/content */

define(
	[
		'jquery',
		'app/ui/questionnaire/data',
		'mout/object/forOwn',
		'mout/object/deepMatches',
		'mout/object/hasOwn',
		'evensteven',
		'throttledebounce',
		'pubsub'
	],

	function ( $, QuestionnaireData, forOwn, deepMatches, hasOwn ) {

		var Content;
		var $main;
		var $options;
		var $summary;
		var $stages;
		var $steps;

		return {

			init: function () {
				Content = this;
				$main = $('#js-questionnaire-main');
				$summary = $('#js-questionnaire-end');
				$stages = $main.find('.js-questionnaire-stage');
				$steps = $stages.find('.js-questionnaire-section');
				$options = $steps.find( '.js-input-toggle' );
				this._initEvents();
				this._initSubscriptions();
			},
			_initSubscriptions: function(){
				$.subscribe('/questionnaire/content/toggle/equalise', this._initButtonEqualisation);
				$.subscribe('/questionnaire/content/buttons/text', this._processButtonChange );
				$.subscribe('/questionnaire/submit/form/confirmation', this._processPostSubmitEvents );
			},
			_initEvents: function(){
				$main.on('click', '.js-input-toggle', this._processOptionClick );
				$main.find( '.questionnaire-toggle' ).on('blur', '[required]', this._processInputBlur);
				$main.find( '.questionnaire-toggle' ).on('keyup', '[required]:not([type="email"])', $.debounce(250, this._processInputBlur));
				$main.find( '.questionnaire-toggle' ).on('change', '[required]:not([type="email"])', $.debounce(250, this._processInputBlur));
				$summary.on('blur', '[required]', this._processInputBlur);
				$summary.on('keyup', '[required]:not([type="email"])', $.debounce(250, this._processInputBlur));
				$summary.on('change', '[required]:not([type="email"])', $.debounce(250, this._processInputBlur));
				$summary.on( 'click', '.js-submit-email', this._submitEmail );
				$main.find('.js-financial').on('blur', '[pattern]:not([required])', this._processNonRequiredPatternInput);
			},
			_initButtonEqualisation: function( data ){
				var $step = data.$step;
				$step.find( '.js-input-toggle-btn' ).evenSteven({
					resize: true
				});
			},
			_processButtonChange: function( data ) {
				var $thisStep = data.$step;
				var $thisOption = $thisStep.find( '.js-input-toggle.is-selected' );
				var $toggleContainer = $thisOption.closest( '.questionnaire-toggle' );
				var $answerContainer = $toggleContainer.find( '.js-questionnaire-toggle-answer' );
				var optionContainsForm = Content._checkIfContainsContent( '.js-questionnaire-form', $thisOption, $answerContainer );
				Content._setButtonText( optionContainsForm, $toggleContainer );
			},
			_processPostSubmitEvents: function( data ){
				if( !data.data.CompletedForm ) {
					var message = data.success ? 'The summary has been sent to your email' : 'Sorry, there was a problem sending the summary to your email';
					Content._showConfirmation($('.js-form-confirmation'), message);
				}
			},
			_processOptionClick: function(){
				var $thisOption = $(this);
				if( !$thisOption.is( '.is-selected' ) ) {

					var $toggleContainer = $thisOption.closest( '.questionnaire-toggle' );
					var $answerContainer = $toggleContainer.find( '.js-questionnaire-toggle-answer' );
					var $currentSelected = $toggleContainer.find( '.js-input-toggle.is-selected' );
					var contentToShow = $thisOption.nextAll( '.js-questionnaire-toggle-content' ).html();

					//Move Current Selected so we can use it later
					if( $toggleContainer.find( '.js-input-toggle.is-selected' ).length ) {
						$.publish( '/questionnaire/responsive/forceToggle', [{
							$thisStep: $currentSelected.closest( '.js-questionnaire-section' )
						}] );
					}

					$currentSelected.removeClass( 'is-selected' );
					$currentSelected.next( '.js-input-toggle-btn' ).removeClass( 'is-selected' );
					$currentSelected.nextAll( '.js-questionnaire-toggle-content' ).removeClass( 'is-visible' );
					$thisOption.addClass( 'is-selected' );
					$thisOption.next( '.js-input-toggle-btn' ).addClass( 'is-selected' );
					$thisOption.nextAll( '.js-questionnaire-toggle-content' ).addClass( 'is-visible' );

					if ( !$thisOption.is( '.has-no-content' ) ) {
						$.publish( '/questionnaire/responsive/toggle', [{
							$thisStep: $thisOption.closest( '.js-questionnaire-section' )
						}] );
					}

					var optionContainsForm = Content._checkIfContainsContent( '.js-questionnaire-form', $thisOption, $answerContainer );
					if( optionContainsForm ) {
						//Populate Customer details form
						var $form = $toggleContainer.find( '.js-questionnaire-form' );
						Content._populateFormFields( $form );
						Content._checkIfFormIsValid( $form );
					} else {
						if( Content._checkIfContainsContent( '.js-financial', $thisOption, $answerContainer ) ){
							//Populate Financial Data fields
							var $financialForm = $toggleContainer.find( '.js-financial' );
							var sectionId = $toggleContainer.closest( '.js-questionnaire-step' ).attr( 'data-step' );
							var relevantSection = Content._getRelevantSection( sectionId );
							Content._populateFinancialData( $financialForm, sectionId, relevantSection );
						}
						$.publish( '/questionnaire/controls/unlock' );
					}

					$.publish( '/scroll/to', [{
						element: $thisOption,
						threshold: 200
					}] );

					Content._setButtonText( optionContainsForm, $toggleContainer );
				}
			},
			_processInputBlur: function( e ){
				var $thisInput = $(this);
				Content._checkIfInputIsValid( $thisInput, true, true );
				Content._checkIfFormIsValid( $thisInput.closest( '.js-questionnaire-form, .js-summary' ) );
			},
			_processNonRequiredPatternInput: function( event ) {
				var pattern;
				var value = this.value;
				var $thisInput = $(this);
				if( !value ) {
					return;
				}
				Content._checkIfInputIsValid( $thisInput, false, true );
			},
			_submitEmail: function( event ){
				event.preventDefault();
				var isValid = Content._checkIfFormIsValid( $(this).closest( '.js-questionnaire-summary-email' ) );
				if( !isValid ) {
					return;
				}
				$.publish( '/questionnaire/data/save/email' );
				$.publish( '/questionnaire/submit/form' );
			},
			_checkIfContainsContent: function ( contentToFind, $selectedOption, $answerContainer ) {
				var $selectedContent = $selectedOption.nextAll( '.js-questionnaire-toggle-content' );
				return $answerContainer.find( contentToFind ).length || $selectedContent.find( contentToFind ).length;
			},
			_checkIfInputIsValid: function( $input, isRequired, singleInputCheck ) {
				var isValid = true;
				var value = $input[0].value;
				//Workaround for templayed regex bug (Regex gets re-written when passed through JS template )
				var emailRegex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,6}|[0-9]{1,3})(\]?)$/;
				var pattern = ($input.is('.has-pattern') || $input.is( '[type="email"]' )) && !$input.attr( 'pattern' ) ? emailRegex : $input.attr( 'pattern' );
				if( isRequired && value === '' || ( pattern && !( new RegExp( pattern ).test( value ))) ) {
					isValid = false;
				}
				if( singleInputCheck ) {
					var action = isValid ? 'hide' : 'show';
					Content._showHideError( $input, action );
				}
				return isValid;
			},
			_checkIfFormIsValid: function( $form ) {
				var isValid = true;
				$form.find( '[required]' ).each( function(){
					var $thisInput = $(this);
					if( !isValid ) {
						return false;
					}
					isValid = Content._checkIfInputIsValid( $thisInput, true );
				} );
				if( isValid ) {
					$.publish( '/questionnaire/controls/unlock' );
					return isValid;
				}
				$.publish( '/questionnaire/controls/lock' );
				return isValid
			},
			_showHideError: function( $input, action ){
				var hiddenClassAction = 'remove';
				var visibleClassAction = 'add';
				var $error = $input.next( '.js-error' ).length ? $input.next( '.js-error' ) : $input.closest( '.js-input-container' ).next( '.js-error' );

				if ( action === 'hide' ) {
					hiddenClassAction = 'add';
					visibleClassAction = 'remove';
				}

				$error[hiddenClassAction + 'Class']( 'is-hidden' )[visibleClassAction + 'Class']( 'is-visible' );
				$input[visibleClassAction + 'Class']( 'input-validation-error' );
			},
			_showConfirmation: function( $confirmation, message ){
				$confirmation.removeClass( 'is-hidden' ).addClass( 'is-visible' ).find('.js-form-confirmation__text').html(message);
			},
			_populateFormFields: function( $form ) {
				var data = QuestionnaireData.getData();
				forOwn(data, function( value, key, obj ){
					var $input = $form.find( '[data-input="' + key + '"]' );
					if( $input.length ) {
						if ( $input.attr('type') === 'checkbox' ) {
							$input[0].checked = value;
							return;
						}
						$input[0].value = value;
					}
				});
			},
			_populateFinancialData: function( $financialForm, currentSectionId, section ) {
				var csvData;
				var csvArray;
				var csvContent = [];
				var $titles = $financialForm.find( '.js-financial-title' );
				var $labels = $financialForm.find( '.js-financial-label' );
				var $inputs = $financialForm.find( '.js-financial-input' );
				if ( section.LineItems ) {
					$.each( section.LineItems, function( index, obj ){
						var id = obj.Id;
						if ( currentSectionId === id ) {
							csvData = obj.CsvData;
						}
					});
					csvArray = csvData.split("\n")
					csvArray.shift(0);
					for( var i = 0, length = csvArray.length; i < length; i++ ) {
						var tmp = {};
						var current = csvArray[i];
						var rowSplit = current.split(',');
						var title = $.trim(rowSplit.shift(0));
						tmp['title'] = $.trim(title);
						tmp['values'] = rowSplit;
						csvContent.push( tmp );
					}
				}
				for( var i = 0, length = csvContent.length; i < length; i++ ) {
					var current = csvContent[i];
					var title = current.title;
					var values = current.values;
					var $filteredLabels = $labels.filter( function(){
						return $(this).text() === title;
					} );

					for( var j = 0, labelsLength = $filteredLabels.length; j < labelsLength; j++ ) {
						var $current = $filteredLabels.eq(j);
						var value = values[j];
						$current.next().find('input')[0].value = value;
					}

				}
				return csvContent;
			},
			_getRelevantSection: function( id ){
				var section = {};
				var assessment = QuestionnaireData.getData().ReadinessAssessment;
				if( assessment && hasOwn( assessment, 'Sections' ) ) {
					var sections = assessment.Sections;
					$.each( sections, function( index, obj ) {
						var lineItems = obj.LineItems;
						if( deepMatches( obj, { LineItems: [ { Id : id } ] } ) ) {
							section = obj;
							return false;
						}
					});
				}
				return section;
			},
			_setButtonText: function( optionContainsForm, $toggleContainer ) {
				var nextText = 'Next';

				if ( optionContainsForm ) {
					nextText = 'Submit & view summary';
				} else if ( !optionContainsForm && $toggleContainer.find( '.js-questionnaire-form' ).length ) {
					nextText = 'View summary';
				}

				$.publish( '/questionnaire/controls/text', [{
					nextText: nextText,
					prevText: 'Back'
				}] );
			}
		}

	}
);

