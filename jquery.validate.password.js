/*
 * jQuery validate.password plug-in 1.0
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validate.password/
 *
 * Copyright (c) 2009 Jörn Zaefferer
 *
 * $Id$
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function($) {

    var LOWER = /[a-z]/,
        UPPER = /[A-Z]/,
        DIGIT = /[0-9]/,
        DIGITS = /[0-9].*[0-9]/,
        SPECIAL = /[-!@#\$%\^&\*_\+=\\[\]\.:;\?\/\,\(\)]/,
        SAME = /^(.)\1+$/,
        NOTALLOWED = /[^-!@#\$%\^&\*_\+=[\]\.:;\?\/\,\(\)0-9a-zA-Z]/;


    function rating(rate, message) {
        return {
            rate: rate,
            messageKey: message
        };
    }

    function uncapitalize(str) {
        return str.substring(0, 1).toLowerCase() + str.substring(1);
    }

    $.validator.passwordRating = function(password, username) {
        if (NOTALLOWED.test(password))
            return rating(1, "not-allowed");
        if (!password || password.length < 6)
            return rating(0, "too-short");
        if (password.length > 100)
            return rating(0, "too-long");
        if (username && password.toLowerCase().match(username.toLowerCase()))
            return rating(0, "similar-to-username");
        if (SAME.test(password))
            return rating(1, "very-weak");

        var lower = LOWER.test(password),
            upper = UPPER.test(uncapitalize(password)),
            digit = DIGIT.test(password),
            digits = DIGITS.test(password),
            special = SPECIAL.test(password);
        if (!digit || !special)
            return rating(0, "too-weak");
        if (lower && upper && digit)
            return rating(4, "strong");
        if (lower && upper || lower && digit || upper && digit)
            return rating(3, "good");
        return rating(2, "weak");
    }

    $.validator.passwordRating.messages = {
        "similar-to-username": "Too similar to username",
        "not-allowed": "Invalid character",
        "too-short": "Too short",
        "too-long": "Too long",
        "too-weak": "Too weak",
        "very-weak": "Very weak",
        "weak": "Weak",
        "good": "Good",
        "strong": "Strong"
    };

    $.validator.addMethod("password", function(value, element, usernameField) {
        if($(element).hasClass('repeat-password') || $(element).hasClass('dontvalidate-password')) {
            return true;
        }
        // use untrimmed value
        var password = element.value,
        // get username for comparison, if specified
            username = $(typeof usernameField != "boolean" ? usernameField : []);

        var rating = $.validator.passwordRating(password, username.val());
        // update message for this field

        var meter = $(".password-meter", element.form);

        meter.find(".password-meter-bar").removeClass().addClass("password-meter-bar").addClass("password-meter-" + rating.messageKey);
        meter.find(".password-meter-message")
            .removeClass()
            .addClass("password-meter-message")
            .addClass("password-meter-message-" + rating.messageKey)
            .text($.validator.passwordRating.messages[rating.messageKey]);
        // display process bar instead of error message
	$(document).trigger('updateshadowdom');

        return rating.rate > 2;
    }, "&nbsp;");
    // manually add class rule, to make username param optional
    $.validator.classRuleSettings.password = { password: true };

})(jQuery);
