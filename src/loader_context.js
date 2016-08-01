import { setActionStatusDone } from './actions-reducer'
export default function (parent) {
    if (parent && !parent.hasExecuted) {
        throw new Error('invalid parent')
    }
    const executedIds = new Map()

    function hasExecuted(id) {
        return executedIds.has(id) || (
            parent != null ? parent.hasExecuted(id) : false
        )
    }

    function execute(dispatch, actions) {
        actions.forEach(({ id, action, args, debug }) => {
            if (!hasExecuted(id)) {
                let tmp
                if (debug) {
                    /* eslint-disable no-console */
                    const groupName = `action: ${id}`
                    console.groupCollapsed(groupName)
                    console.log('...args: ', ...args)
                    try {
                        tmp = dispatch(action(...args))
                    } catch (e) {
                        console.error('Error executing:', id)
                        throw e
                    } finally {
                        console.groupEnd(groupName)
                    }
                    /* eslint-enable no-console */
                } else {
                    tmp = dispatch(action(...args))
                }
                executedIds.set(id, true)

                if (!tmp || !tmp.then) {
                    // Use the thunk middleware and return a promise from the thunk.
                    throw new Error('Actions need to return a promise')
                } else {
                    tmp.then(
                        () => dispatch(setActionStatusDone(id))
                    )
                }
            }
        })
    }

    return {
        execute,
        hasExecuted,
    }
}
