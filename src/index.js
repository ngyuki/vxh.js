window.onerror = function(messageOrEvent, source, lineno, colno, error) {
    console.warn(messageOrEvent + " ... " + source + " (" + lineno + ")");
};

$(function(){
    $vxh.event.init();

    $vxh.rule({
        int: {
            validate (elem) {
                return /^\d+$/.test(elem.value);
            },
            message: "整数です",
        },
        range: {
            validate (elem, min, max) {
                var value = elem.value - 0;
                return min <= value && max >= value;
            },
            params: ['min', 'max'],
            message (elem, min, max) {
                return `${min} ～ ${max} の範囲で入力してください`;
            }
        },
        checked: {
            validate (elem) {
                return $(elem).find('input:checked').length > 0;
            },
            message (elem) {
                return `いずれかを選択してください`;
            }
        },
    });
});
