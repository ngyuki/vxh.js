"use strict";

window.onerror = function (messageOrEvent, source, lineno, colno, error) {
    console.warn(messageOrEvent + " ... " + source + " (" + lineno + ")");
};

$(function () {
    $vxh.event.init();

    $vxh.rule({
        int: {
            validate: function validate(elem) {
                return (/^\d+$/.test(elem.value)
                );
            },

            message: "整数です"
        },
        range: {
            validate: function validate(elem, min, max) {
                var value = elem.value - 0;
                return min <= value && max >= value;
            },

            params: ['min', 'max'],
            message: function message(elem, min, max) {
                return min + " \uFF5E " + max + " \u306E\u7BC4\u56F2\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044";
            }
        },
        checked: {
            validate: function validate(elem) {
                return $(elem).find('input:checked').length > 0;
            },
            message: function message(elem) {
                return "\u3044\u305A\u308C\u304B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044";
            }
        }
    });
});
//# sourceMappingURL=index.js.map
