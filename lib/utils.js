"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.map = map;
exports.reduce = reduce;
function map(objOrArray, fn) {
    if (Array.isArray(objOrArray)) {
        return objOrArray.map(fn);
    }

    return Object.keys(objOrArray).reduce(function (memo, key) {
        memo[key] = fn(objOrArray[key], key);
        return memo;
    }, {});
}

function reduce(objOrArray, fn, value) {
    if (Array.isArray(objOrArray)) {
        return objOrArray.reduce(fn, value);
    }

    return Object.keys(objOrArray).reduce(function (memo, key) {
        return fn(memo, objOrArray[key], key);
    }, value);
}