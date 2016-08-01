export const ACTION_DONE = '@@fetchTree/action_done'

export const setActionStatusDone = (id) => ({
    type: ACTION_DONE,
    payload: id,
})

export const selectIsReady = (state, id) => state.fetchTree && state.fetchTree[id] != null

export default function reducer(state = {}, action) {
    if (action.type !== ACTION_DONE) return state
    return {
        ...state,
        [action.payload]: true,
    }
}
