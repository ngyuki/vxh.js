$vxh.event = (function(){

    function validate(elem){
        const error = $vxh.validate(elem);
        if (error !== elem.getAttribute('data-error') ) {
            if (error.length) {
                elem.setAttribute('data-error', error);
            } else {
                elem.removeAttribute('data-error');
            }
            $(elem).trigger($.Event('validated.vx', { error }));
        }
        return error.length === 0;
    }

    function init() {

        $(document.body).on('submit', (ev) => {
            const form = ev.target;
            if (form instanceof HTMLFormElement) {
                const invalid = $('[data-vx-rule]', form).add(form.elements).toArray().reduce((r, elem) => {
                    return validate(elem) ? r : r || elem;
                }, null);
                if (invalid) {
                    ev.preventDefault();
                    ev.stopImmediatePropagation();
                    invalid.focus();
                }
            }
        });

        $(document.body).on('input', ev => {
            if (ev.target.validity) {
                validate(ev.target);
            }
            $(ev.target).closest('[data-vx-rule]').each(function(){
                validate(this);
            })
        });

        $(document.body).on('focus', '[data-error]', ev => {
            $(ev.currentTarget).popover('show');
        });

        $(document.body).on('blur', '[data-error]', ev => {
            $(ev.currentTarget).popover('hide');
        });

        $(document.body).on('mouseenter', '[data-error]', ev => {
            $(ev.currentTarget).popover('show');
        });

        $(document.body).on('mouseleave', '[data-error]', ev => {
            $(ev.target).is(':focus') || $(ev.target).children(':focus')
            if (ev.target !== document.activeElement) {
                $(ev.currentTarget).popover('hide');
            }
        });

        $(document.body).on('validated.vx', ev => {
            const $elem = $(ev.target);
            if (ev.error) {
                $elem.popover('dispose');
                $elem.popover({
                    trigger: 'manual',
                    content: ev.error,
                });
                if (ev.target === document.activeElement) {
                    $elem.popover('show');
                }
            } else {
                $elem.popover('dispose');
            }
        });
    }

    return {
        init,
    };
}());
