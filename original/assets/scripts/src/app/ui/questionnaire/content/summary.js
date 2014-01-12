/* app/ui/questionnaire/content/summary */

define(
	[
		'jquery',
		'app/ui/questionnaire/data',
		'templayed',
		'printernator'
	],

	function ( $, Data, templayed ) {

		var Summary;
		var $summary;
		var $summaryContent;
		var $end;
		var tmplReadiness;
		var tmplDetails;
		var tmplStageItem;

		return {

			init: function () {
				Summary = this;
				$end = $( '#js-questionnaire-end' );
				$summaryContent = $( '.js-summary-content' );
				$summary = $summaryContent.find( '.js-summary' );
				tmplReadiness = $( '#js-summary-readiness' ).html();
				tmplInstructions = $( '#js-summary-instructions' ).html();
				tmplDetails = $( '#js-summary-details' ).html();
				tmplStageItem = $( '#js-summary-stage-item' ).html();
				tmplEmailForm = $( '#js-summary-email-address' ).html();
				this._initSubscriptions();
				this._initPrint();
			},
			_initSubscriptions: function() {
				$.subscribe( '/questionnaire/summary/render', this._renderSummary );
			},
			_initPrint: function(){
				$( '.js-print' ).printernator();
			},
			_renderSummary: function(){
				var data = Data.getData();
				Summary._cleanUpPreviousSummary();
				Summary._renderReadiness( data );
				Summary._renderInstructions( data );
				Summary._renderStages( data );
				Summary._renderDetails( data );
				Summary._renderEmailForm( data );
			},
			_cleanUpPreviousSummary: function (){
				$end.find( '[data-questionnaire-contact], .js-questionnaire-summary-email, [data-status-ready]' ).empty().remove();
				$end.find(' .js-summary').empty();
			},
			_renderReadiness: function( data ){
				var compiledTemplate = this._compileTemplate( tmplReadiness, data.ReadinessAssessment );
				$summary.before( compiledTemplate );
			},
			_renderInstructions: function( data ) {
				var instructionsData = {
					ContactApproved: data.CompletedForm + '',
					ContactDisapproved: !data.CompletedForm + ''
				};
				var compiledTemplate = this._compileTemplate( tmplInstructions, instructionsData  );
				$end.find('.js-print').before( compiledTemplate );
			},
			_renderStages: function( data ){
				var sections = data.ReadinessAssessment.Sections;
				for( var i = 0, length = sections.length; i < length; i++ ) {
					var currentSection = sections[i];
					var LineItems = currentSection.LineItems;
					currentSection.Stage = i + 1;
					Summary._compileAndInsertTemplate($summary, tmplStageItem, currentSection, 'append');
				}
			},
			_renderDetails: function( data ) {
				Summary._compileAndInsertTemplate($summary, tmplDetails, data, 'append');
			},
			_renderEmailForm: function( data ) {
				var compiledTemplate = this._compileTemplate( tmplEmailForm, data  );
				$summaryContent.after( compiledTemplate );
			},
			_compileTemplate: function ( template, vars ) {
				template = template.replace(/(\r\n|\n|\r)/gm, '');
				return templayed(template)(vars);
			},
			_compileAndInsertTemplate: function ($container, template, vars, action) {
				var compiledTemplate;
				var insertionType = action === 'append' ? 'append' : 'html';
				compiledTemplate = this._compileTemplate( template, vars );
				$container[insertionType](compiledTemplate);
			}

		};

	}
);


