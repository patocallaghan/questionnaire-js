/* app/page/blogPost */

define( 
	[
		'jquery',
		'migrate',
		'validateUnobtrusive'
	],
	function ( $ ) {


		var $blogForm = $( '#blogCommentForm' );
		var $commentForm = $( '#commentform' );
		var $commentLoading = $('#commentLoading');

		var validatorReady = function () {
			if (typeof $blogForm.data("validator") !== 'undefined') {
				$blogForm.data("validator").settings.submitHandler = function (form) {
					var ret = setUpForm();
					//if (ret !== false) form.submit();
				};
			} else {
				setTimeout( function () {
					validatorReady();
				}, 250 );
			}
		};

		if ( $blogForm.length > 0 ) {
			validatorReady();
		}

		var setUpForm = function () {
			$commentForm.hide();
			$commentLoading.show();
			$commentForm.find(' #submit ' ).attr( "enabled", false );

			var posturl = "/base/UComment/CreateComment/" + $( "#commentform #formPageId" ).val() + ".aspx";

				$.post(posturl, {
						author: $commentForm.find("#author").val(),
						email: $commentForm.find('#email').val(),
						url: $commentForm.find('#url').val(),
						comment: $commentForm.find('#comment').val()
					},
					function(data) {

						$commentLoading.hide();
						$("#commentPosted").show().removeClass("error");

						if (data == 0) {
							$("#commentPosted").addClass("error").html("Your comment could not be posted, we're very sorry for the inconvenience");
							$commentForm.show();
							$commentForm.find('#submit').attr("enabled", true);
						}

					});

			return false;

		};


	}
);





