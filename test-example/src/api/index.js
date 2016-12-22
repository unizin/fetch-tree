import * as api from './api'

let counts = {}

Object.keys(api).reduce((api, k) => {
    const implementation = api[k]

    api[k] = function apiCounter(...args) {
        counts[k] = 1 + (counts[k] || 0)
        return implementation.apply(this, args)
    }

    return api
}, api)


export const resetCounts = () => { counts = {} }
export const getCounts = () => counts

export default api
