const $vxh = (function(){

    const _rules = {
        required: {
            message: '入力必須です',
        },
        pattern: {
            message: '入力値のパターンが正しくありません',
        },

        // rule: {
        //     validate (elem, arg1, arg2) {
        //         return true or false;
        //     },
        //
        //     params: ['arg1', 'arg2'],
        //
        //     message: 'エラーメッセージ ${arg1} ${arg2}',
        //     message (elem, arg1, arg2) {
        //         return `エラーメッセージ ${arg1} ${arg2}`;
        //     },
        // }
    };

    function rule(rules) {
        Object.keys(rules).forEach((ruleName) => {
            _rules[ruleName] = rules[ruleName]
        });
    }

    function memoize(func) {
        return (function(){
            const cache = {};
            return function(attr){
                if (!attr) {
                    return {};
                }
                if (!cache.hasOwnProperty(attr)) {
                    cache[attr] = func(attr);
                }
                return cache[attr];
            };
        }());
    }

    const parseRuleAttribute = memoize((attr) => {
        return attr.split(';').reduce((r, str) => {
            str = str.replace(/^\s+/, '');
            if (str.length === 0) {
                return r;
            }
            const [name, args] = str.split(':', 2);
            if (args === undefined) {
                r[name] = [];
            } else {
                r[name] = args.split(',');
            }
            return r;
        }, {});
    });

    const parseMessageAttribute = memoize((attr)  => {
        return attr.split(';').reduce((r, str) => {
            str = str.replace(/^\s+/, '');
            if (str.length === 0) {
                return r;
            }
            const [name, message] = str.split(':', 2);
            if (message === undefined) {
                return r;
            }
            r[name] = message;
            return r;
        }, {});
    });

    function execute(elem) {

        const validityMap = {
            valueMissing: 'required',
            patternMismatch: 'pattern',
        };

        if (elem.validity) {
            for (let prop of Object.keys(validityMap)) {
                if (elem.validity[prop]) {
                    const ruleName = validityMap[prop];
                    return [ruleName, []];
                }
            }
        }

        const ruleAttributes = parseRuleAttribute(elem.getAttribute('data-vx-rule'));

        for (let ruleName of Object.keys(ruleAttributes)) {
            if (!_rules[ruleName] || !_rules[ruleName].validate) {
                console.error(`undefined rule.validate "${ruleName}"`);
                continue;
            }
            const ruleArgs = ruleAttributes[ruleName];
            const ok = _rules[ruleName].validate(elem, ...ruleArgs);
            if (ok) {
                continue;
            }

            return [ruleName, ruleArgs];
        }

        return [null, []];
    }

    function format(elem, ruleName, ruleArgs, message) {

        if (typeof message === 'function') {
            return message(elem, ...ruleArgs);
        }

        if (ruleArgs.length === 0) {
            return message;
        }

        const params = {};

        ruleArgs.forEach((v, i) => {
            if (ruleArgs[i] !== undefined) {
                params[i] = ruleArgs[i];
            }
        });

        if (_rules[ruleName] && _rules[ruleName].params) {
            _rules[ruleName].params.forEach((v, i) => {
                if (ruleArgs[i] !== undefined) {
                    params[v] = ruleArgs[i];
                }
            });
        }

        return message.replace(/\${(\w+)}/g, (str, tag)=>{
            if (params.hasOwnProperty(tag)) {
                return params[tag];
            }
            return str;
        });
    }

    function validate(elem) {

        const [ruleName, args] = execute(elem);
        if (!ruleName) {
            return '';
        }

        const messages = parseMessageAttribute(elem.getAttribute('data-vx-message'));
        const message = messages[ruleName] || _rules[ruleName].message || `error:${ruleName}`;
        return format(elem, ruleName, args, message);
    }

    return {
        rule,
        validate,
    };
}());
