QuestionnaireApp.factory('Session', function( $routeParams ){

  var maxStep ='0';
  var Session = {
    currentStep: function() {
      return $routeParams.questionNumber ? $routeParams.questionNumber : '0';
    },
    maxStep: function(){
      var questionNumber = $routeParams.questionNumber;
      if ( questionNumber > maxStep ) {
        maxStep = questionNumber;
      }
      return maxStep;
    }
  };
  return Session;
});

QuestionnaireApp.factory('Data', function( $routeParams ){
  return {
    questionNumber: $routeParams.questionNumber,
    isStageShown: function(stage){
      return new RegExp('\\d+').exec($routeParams.questionNumber)[0] == stage;
    },
    isStepShown: function(step){
      return $routeParams.questionNumber == step;
    }
  };
});

QuestionnaireApp.factory('Menu', function( $routeParams, Session ){

  var maxStep = 0;
  function isCurrent ( step, number ){
    var stage;
    if(number) {
      stage = number == step ? number : new RegExp('\\d+').exec($routeParams.questionNumber)[0];
    } else {
      stage = '-1';
    }
    return stage === step ? 'is-current' : '';
  }

  function isCompleted ( questionNumber ){
    return questionNumber <= Session.maxStep() ? 'is-completed' : '';
  }

  return {
    questionNumber: $routeParams.questionNumber,
    isStartShown: function(){
      return !$routeParams.questionNumber;
    },
    isMenuShown: function(){
      return $routeParams.questionNumber;
    },
    setStateClasses: function( step ){
      var currentClass = isCurrent( step, $routeParams.questionNumber );
      var completedClass = isCompleted( step, $routeParams.questionNumber );
      return currentClass + ' ' + completedClass;
    }
  };
});


