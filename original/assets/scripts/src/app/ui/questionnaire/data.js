/* app/ui/questionnaire/data */

define(
	[
		'jquery',
		'app/ui/questionnaire/state',
		'mout/object/deepMatches',
		'mout/array/unique',
		'pubsub'
	],

	function ( $, State, deepMatches, unique ) {

		var data;
		var $main;
		var $options;
		var $summary;
		var $stages;
		var $steps;
		var stage;
		var lastStage;
		var validData =
			{
				"FirstName": "Michael",
				"LastName": "Anderson",
				"JobTitle": "CEO",
				"CompanyName": "Anderson's Lamps",
				"Email": "michael@andersons.co.nz",
				"PhoneNumber": "095325268",
				"CompanyWebsite": "www.andersons.co.nz",
				"Feedback": "It really helped me see the gaps in my plan - it would be great to get some help with these.",
				"SignUpForNewsletter": true,
				"EmailText": "HTML summary of response",
				"EmailOnly": false,
				"ReadinessAssessment": {
					"Ready": false,
					"Sections": [
						{
							"Name": "What's putting your business in a great position to grow internationally?",
							"LineItems": [
								{
									"Id": "1a",
									"Name": "Competitive Advantage",
									"Ready": true,
									"RelatedLinks": [
										"www.google.com",
										"www.yahoo.com"
									]
								},
								{
									"Id": "1b",
									"Name": "Market Validation",
									"Ready": false,
									"RelatedLinks": [
										"www.google.com",
										"www.yahoo.com"
									]
								}
							]
						},
						{
							"Name": "International growth = ambition & potential growth",
							"LineItems": [
								{
									"Id": "2",
									"Name": "Your Financial Data",
									"Ready": true,
									"CsvData": ",Current,Next Year,Year 2,Year 3\\nTotal Sales Revenue ($),1200000,1300000,1500000,2200000\\nTotal International Sales Revenue ($),,,50000,80000"
								}
							]
						}
					]
				}
			};

		return {

			init: function () {
				Data = this;
				data = {};
				stage = {
					'Name': '',
					'LineItems': []
				};
				$main = $('#js-questionnaire-main');
				$summary = $('#js-questionnaire-end');
				$stages = $main.find('.js-questionnaire-stage');
				$steps = $stages.find('.js-questionnaire-section');
				$options = $steps.find( '.js-input-toggle' );
				lastStage = State.getState().lastStage;
				this._initSubscriptions();
			},
			getData: function(){
				//return validData;
				return data;
			},
			updateData: function(){
			},
			setData: function(){
				this._setFormData();
			},
			_initSubscriptions: function(){
				$.subscribe( '/questionnaire/data/save', this._saveData );
				$.subscribe( '/questionnaire/data/save/email', this._saveEmail );
			},
			_saveData: function(){
				Data._saveNodeInformation();
				Data._saveCompletedForm();
				Data._saveAllForms();
				Data._saveAllStages();
				Data._saveContactStage();
			},
			_saveNodeInformation: function(){
				data.nodeId = $main.attr( 'data-nodeid' );
			},
			_saveEmail: function(){
				data.Email = $summary.find( '.js-summary-email' )[0].value;
				data.EmailOnly = true;
			},
			_saveCompletedForm: function(){
				var $lastStage = $steps.filter( '[data-step="' + lastStage + '"]' );
				var $selectedOption = $lastStage.find( '.js-input-toggle.is-selected' );
				data.CompletedForm = $selectedOption.is( '.is-green' );
			},
			_saveAllForms: function(){
				$stages.each(function(){
					var $form;
					var $thisStage = $(this);
					$form = $thisStage.find( '.questionnaire-toggle' ).find('.js-questionnaire-form');
					$form = $form.length ? $form : $thisStage.find('.js-questionnaire-form');
					if( $form.length ) {
						Data._saveSingleForm( $form );
					}
				});
			},
			_saveContactStage: function() {
				data.ContactStageNumber = data.ReadinessAssessment.Sections.length + 1;
			},
			_saveSingleForm: function( $form ) {
				$form.find('[data-input]').each( Data._saveInput );
			},
			_saveInput: function(){
				var $thisInput = $(this);
				var key = $thisInput.attr('data-input');
				var value = $thisInput[0].value;

				if($thisInput.is('[type="checkbox"]')) {
					value = value === 'on' ? true : false;
				}

				data[key] = value;
			},
			_saveAllStages: function(){
				if( $stages.length ) {
					data.ReadinessAssessment = {};
					data.ReadinessAssessment.Sections = [];
					$stages.each( this._saveSingleStage );
					data.ReadinessAssessment.Ready = this._isGlobalReadyStateValid();
					data.ReadinessAssessment.ReadyState = data.ReadinessAssessment.Ready + '';
					data.ReadinessAssessment.ReadyText = data.ReadinessAssessment.ReadyText ? 'Ready' : 'Not ready';
					data.ReadinessAssessment.ReadyDescription = this._getReadinessDescription( data.ReadinessAssessment.Ready);
				}
			},
			_saveSingleStage: function(){
				var $stage = $(this);
				var sections = data.ReadinessAssessment.Sections;
				if( $stage.find( '.js-questionnaire-step' ).attr( 'data-step' ) !== lastStage ) {
					var name = $.trim($stage.find( '.js-questionnaire-stage-name' ).text());
					var tmp = {};
					tmp.Name = name;
					var $currentSteps = $stage.find( '.js-questionnaire-step' );
					tmp.LineItems = Data._saveSteps( $currentSteps );
					sections.push(tmp);
				}
			},
			_saveSteps: function( $currentSteps ) {
				var tmpArray = [];
				// {
				// 	"Id": "1b",
				// 	"Name": "Market Validation",
				// 	"Ready": false,
				// 	"RelatedLinks": [
				// 		"www.google.com",
				// 		"www.yahoo.com"
				// 	]
				// }
				$currentSteps.each( function() {
					var tmp = {};
					var $thisStep = $(this);
					var $financialForm = $thisStep.find( '.questionnaire-toggle' ).find( '.js-financial');
					tmp.Name = $.trim($thisStep.find( '.js-questionnaire-section-heading' ).text());
				    tmp.RelatedLinksText = Data._getLinksText($thisStep);
					tmp.Id = $thisStep.attr('data-step');
					tmp.RelatedLinks = Data._populateLinks( $thisStep );
					tmp.Ready = Data._isSingleReadyStateValid( $thisStep, $financialForm );
					tmp.ReadyIcon = tmp.Ready ? 'tick' : 'minus';
					tmp.ReadyText = tmp.Ready ? 'Ready' : 'Not ready';
					if( $financialForm.length ) {
						tmp.CsvData = Data._setCvsData( $financialForm );
						tmp.FinancialData = Data._setFinancialData( $financialForm );
					} else {
						tmp.FinancialData = [];
					}
					tmp.hasFinancialData = Data._checkIfHasFinancialData( $financialForm );
					tmpArray.push(tmp);
				} );
				return tmpArray;
			},

            _getLinksText: function($thisStep) {
                var $selectedOption = $thisStep.find('.js-input-toggle').filter('.is-selected');
                var $selectedSection = $selectedOption.closest('li');
                var $textDiv = $selectedSection.find('.js-questionnaire-response-blurb');
                var $blurbText = $textDiv.length ? $textDiv.text() : $selectedSection.closest('.questionnaire-content').find('.js-questionnaire-toggle-answer').find('.js-questionnaire-response-blurb').text();

                return $.trim($blurbText);
            },

			_populateLinks: function( $thisStep ){
				var tmpArray = [];
				var $selectedOption = $thisStep.find('.js-input-toggle').filter('.is-selected');
				var $selectedSection = $selectedOption.closest( 'li' );
				var $selectedSectionLinks = $selectedSection.find( '.js-questionnaire-section-link-helpers' );
				var $links = $selectedSectionLinks.length ? $selectedSectionLinks.find( 'a' ) : $selectedSection.closest( '.questionnaire-content' ).find( '.js-questionnaire-toggle-answer' ).find( '.js-questionnaire-section-link-helpers' ).find( 'a' );
				$links.each( function(){
					tmpArray.push( {
						title: $(this).text(),
						url: this.href
					});
				} );
				return tmpArray;
			},
			_isSingleReadyStateValid: function( $thisStep, $financialForm ) {

				if( $financialForm.length ) {
					return Data._isFinancialFormValid( $financialForm );
				}

				return $thisStep.find('.js-input-toggle').filter('.is-selected').is( '.is-green' );
			},
			_isFinancialFormValid: function( $financialForm ) {
				var allFieldsFilledIn = true;
				$financialForm.find( 'input' ).each( function(){
					if( !this.value.length ) {
						allFieldsFilledIn = false;
					}
				} );
				return allFieldsFilledIn;
			},
			_isGlobalReadyStateValid: function(){
				return !deepMatches( data, {
					ReadinessAssessment: {
						Sections: [{
							LineItems: [{
								Ready: false
							}]
						}]
					}
				} );
			},
			_getReadinessDescription: function ( readinessAssessment ) {
				var dataAttribute = readinessAssessment ? 'data-status-ready-text' : 'data-status-not-ready-text';
				return $summary.attr( dataAttribute );
			},
			_setFinancialData: function( $financialForm ) {
				// [{
				// 	Title: 'Current',
				// 	Label1: 'Total Sales Revenue ($)',
				// 	Value1: '150000',
				// 	Label2: 'Total International Sales Revenue ($)',
				// 	Value2: '50000'
				// },{
				// 	Title: 'Next Year',
				// 	Label1: 'Total Sales Revenue ($)',
				// 	Value1: '150000',
				// 	Label2: 'Total International Sales Revenue ($)',
				// 	Value2: '50000'
				// }];
				var data = [];
				$financialForm.find( '.listing-financial-listing' ).children().each(function(){
					var tmp = {};
					var $thisLine = $(this);
					var $groups = $thisLine.find( '.js-financial-group' ).children();
					tmp.Title = $.trim($thisLine.find( '.js-financial-title' ).text());
					$groups.each(function(index){
						var $thisGroup = $(this);
						tmp['Label' + index] = $.trim($thisGroup.find( '.js-financial-label' ).text());
						tmp['Value' + index] = $.trim($thisGroup.find('.js-financial-input')[0].value.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
					});
					data.push( tmp );
				});
				return data;
			},
			_setCvsData: function( $financialForm ){
				//",Current,Next Year,Year 2,Year 3\\nTotal Sales Revenue ($),1200000,1300000,1500000,2200000\\nTotal International Sales Revenue ($),,,50000,80000"
				var data = '';
				var labels = [];
				var uniqueLabels = [];
				var titles = [];
				var uniqueTitles = [];
				var $titles = $financialForm.find( '.js-financial-title' );
				var $labels = $financialForm.find( '.js-financial-label' );
				var $inputs = $financialForm.find( '.js-financial-input' );
				$titles.each( function(){
					titles.push( $.trim( $(this).text() ) );
				} );
				uniqueTitles = unique( titles );
				data += ',' + uniqueTitles.join(',');
				data += '|';
				$labels.each( function( index ){
					labels.push( $.trim($(this).text()) );
				} );
				uniqueLabels = unique( labels );
				for( var j = 0, length = uniqueLabels.length; j < length; j++ ) {
					var currentLabel = uniqueLabels[j];
					var $currentLabels = $labels.filter(function(){
						return currentLabel === $.trim($(this).text());
					});
					var $currentInputs = $currentLabels.closest( 'li' ).find( '.js-financial-input' );
					data += currentLabel;
					$currentInputs.each( function() {
						data += ',' + this.value;
					} );
					data += '|';
				}
				return data;

			},
			_checkIfHasFinancialData: function( $financialForm ){
				var hasData = false;
				$financialForm.find( 'input' ).each( function(){
					if( this.value.length ) {
						hasData = true;
					}
				} );
				return hasData;
			}

		};
	}
);



