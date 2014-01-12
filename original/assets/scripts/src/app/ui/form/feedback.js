/* app/ui/form/feedback */

define(
	[
		'jquery',
		'app/ui/lightbox/common',
		'placeholdit'
	],

	function ($, LightboxCommon) {

		var Feedback;
		var noPlaceholder;
		var phoneField;
		var emailField;

		return {

			init: function () {
				Feedback = this;

				$(document).ready(function () {
					// vars defined
					noPlaceholder = $('.ie9, .ie8').length;
					phoneField = $('#phone');
					emailField = $('#email');
					// init functions
					Feedback._initEvents();
					hideContactDetails();
					$('#support-form').placeholdIt({ submitButton: '.js-support-submit' });

					$("#subject").change(function () {
						var option = $(this).find(":selected").attr('value');
						var $subjectText = $('#subject-textfield');
						if (option == 'other') {
							$subjectText.removeClass('hidden');
							$subjectText.attr('value', '').val('');
						} else {
							$subjectText.attr('value', option).val(option);
							$subjectText.addClass('hidden');
						}
					});

					$("div.contacted select").change(function () {
						var option = $(this).find(":selected").attr('value');

						switch (option) {
							case "email":
								displayEmailField();
								break;
							case "phone":
								displayPhoneField();
								break;
							default:
								hideContactDetails();
								break;
						}
					});

					$('#support-form').submit(function (evt) {
						evt.preventDefault();
						var $form = $(this);
						var $message = $('#support-submission');
						var $colorbox = $form.closest('#cboxContent');
						var isValid = true;
						var subject = jQuery.trim($('#subject-textfield').val());
						var option = $("#contact-method").find(":selected").attr('value');
						var name_value = jQuery.trim($('#name').val());
						var phone_value = jQuery.trim(phoneField.val());
						var email_value = jQuery.trim(emailField.val());

						if (option == "phone" || option == "email") {

							if (name_value.length <= 0) {
								$("#name").next('span').removeClass('hidden');
								isValid = false;
							}
							if ((option == 'phone') && phone_value.length <= 0) {
								phoneField.next('span').removeClass('hidden');
								isValid = false;
							}
							if ((option == 'email') && email_value.length <= 0) {
								emailField.next('span').removeClass('hidden');
								isValid = false;
							}
						}

						if ($('#form209-message').val().length != 0) {
							$('input[name="ticket[message]"]').val($('#form209-message').val());
						}

						if (isValid) {
							//submit the form
							var subjectValue = (subject == '' || subject == '0') ? 'Other' : subject;
							$("#subject-textfield").val(subjectValue);

							if (option != 'email') {
								var emailValue = name_value != '' ? name_value : 'no email';
								$("#email").val(emailValue);
							}
							var url = $form.attr('action');

							$.ajax({
								type: "POST",
								url: url,
								data: $form.serialize()
							}).always(function (data) {
								$form.addClass('hidden');
								$message.removeClass('hidden');
							}).success(function (data) {
								if ($colorbox.length) {
									setTimeout(function () {
										$colorbox.find('.btn-close').trigger('click');
									}, 3000);
								} else {
									window.scrollTo(0, 0);
									setTimeout(function () {
										window.close();
									}, 3000);
								}
							}).fail(function (data) {
								$('#support-submission').find('.cl').html("Sorry there was an error with your form.<br />Your feedback is important to us, please try again later.<br /><small>Status Code (" + data.status + ")</small>");
							});
						}
					});

					function hideContactDetails() {
						$('div.contacted ul').hide();
					}

					function displayEmailField() {
						emailField.val('').show();
						if (noPlaceholder) {
							emailField.val(emailField.attr('placeholder'));
						}
						phoneField.hide().val('').next('span').addClass('hidden');
						$('li.input.r span.hidden').html('* Please fill in your email');
						$('div.contacted ul').show();
					}

					function displayPhoneField() {
						phoneField.val('').show();
						if (noPlaceholder) {
							phoneField.val(phoneField.attr('placeholder'));
						}
						emailField.hide().val('').next('span').addClass('hidden');
						$('li.input.r span.hidden').html('* Please fill in your phone number');
						$('div.contacted ul').show();
					}
				});
			},

			_initEvents: function () {
				var $form = $('#support-form');
				$('#subject').attr('name', 'dummy-subject');
				$('#subject-textfield').attr('name', 'ticket[subject]');
				$form.on('placeholdit.valid', '#name, #email, #phone', { action: 'addClass' }, this._showHideErrors);
				$form.on('placeholdit.invalid', '#name, #email, #phone', { action: 'removeClass' }, this._showHideErrors);
			},

			_showHideErrors: function (e) {
				var action = e.data.action;
				var $thisInput = $(this);
				var $error = $thisInput.next('.error');

				$error[action]('hidden');
			}
		};

	}
);