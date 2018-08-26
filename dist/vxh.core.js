'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var $vxh = function () {

    var _rules = {
        required: {
            message: '入力必須です'
        },
        pattern: {
            message: '入力値のパターンが正しくありません'
        }

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
        Object.keys(rules).forEach(function (ruleName) {
            _rules[ruleName] = rules[ruleName];
        });
    }

    function memoize(func) {
        return function () {
            var cache = {};
            return function (attr) {
                if (!attr) {
                    return {};
                }
                if (!cache.hasOwnProperty(attr)) {
                    cache[attr] = func(attr);
                }
                return cache[attr];
            };
        }();
    }

    var parseRuleAttribute = memoize(function (attr) {
        return attr.split(';').reduce(function (r, str) {
            str = str.replace(/^\s+/, '');
            if (str.length === 0) {
                return r;
            }

            var _str$split = str.split(':', 2),
                _str$split2 = _slicedToArray(_str$split, 2),
                name = _str$split2[0],
                args = _str$split2[1];

            if (args === undefined) {
                r[name] = [];
            } else {
                r[name] = args.split(',');
            }
            return r;
        }, {});
    });

    var parseMessageAttribute = memoize(function (attr) {
        return attr.split(';').reduce(function (r, str) {
            str = str.replace(/^\s+/, '');
            if (str.length === 0) {
                return r;
            }

            var _str$split3 = str.split(':', 2),
                _str$split4 = _slicedToArray(_str$split3, 2),
                name = _str$split4[0],
                message = _str$split4[1];

            if (message === undefined) {
                return r;
            }
            r[name] = message;
            return r;
        }, {});
    });

    function execute(elem) {

        var validityMap = {
            valueMissing: 'required',
            patternMismatch: 'pattern'
        };

        if (elem.validity) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(validityMap)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var prop = _step.value;

                    if (elem.validity[prop]) {
                        var ruleName = validityMap[prop];
                        return [ruleName, []];
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        var ruleAttributes = parseRuleAttribute(elem.getAttribute('data-vx-rule'));

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = Object.keys(ruleAttributes)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _rules$_ruleName;

                var _ruleName = _step2.value;

                if (!_rules[_ruleName] || !_rules[_ruleName].validate) {
                    console.error('undefined rule.validate "' + _ruleName + '"');
                    continue;
                }
                var ruleArgs = ruleAttributes[_ruleName];
                var ok = (_rules$_ruleName = _rules[_ruleName]).validate.apply(_rules$_ruleName, [elem].concat(_toConsumableArray(ruleArgs)));
                if (ok) {
                    continue;
                }

                return [_ruleName, ruleArgs];
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        return [null, []];
    }

    function format(elem, ruleName, ruleArgs, message) {

        if (typeof message === 'function') {
            return message.apply(undefined, [elem].concat(_toConsumableArray(ruleArgs)));
        }

        if (ruleArgs.length === 0) {
            return message;
        }

        var params = {};

        ruleArgs.forEach(function (v, i) {
            if (ruleArgs[i] !== undefined) {
                params[i] = ruleArgs[i];
            }
        });

        if (_rules[ruleName] && _rules[ruleName].params) {
            _rules[ruleName].params.forEach(function (v, i) {
                if (ruleArgs[i] !== undefined) {
                    params[v] = ruleArgs[i];
                }
            });
        }

        return message.replace(/\${(\w+)}/g, function (str, tag) {
            if (params.hasOwnProperty(tag)) {
                return params[tag];
            }
            return str;
        });
    }

    function validate(elem) {
        var _execute = execute(elem),
            _execute2 = _slicedToArray(_execute, 2),
            ruleName = _execute2[0],
            args = _execute2[1];

        if (!ruleName) {
            return '';
        }

        var messages = parseMessageAttribute(elem.getAttribute('data-vx-message'));
        var message = messages[ruleName] || _rules[ruleName].message || 'error:' + ruleName;
        return format(elem, ruleName, args, message);
    }

    return {
        rule: rule,
        validate: validate
    };
}();
//# sourceMappingURL=vxh.core.js.map
