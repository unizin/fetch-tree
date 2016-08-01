

export function map(objOrArray, fn) {
    if (Array.isArray(objOrArray)) {
        return objOrArray.map(fn)
    }

    return Object.keys(objOrArray).reduce(
        (memo, key) => {
            memo[key] = fn(objOrArray[key], key)
            return memo
        },
        {}
    )
}

export function reduce(objOrArray, fn, value) {
    if (Array.isArray(objOrArray)) {
        return objOrArray.reduce(fn, value)
    }

    return Object.keys(objOrArray).reduce(
        (memo, key) => fn(memo, objOrArray[key], key),
        value
    )
}
