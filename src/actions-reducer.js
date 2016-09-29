export const ACTION_DONE = '@@fetchTree/action_done'
export const STORE_ENTITY = '@@fetchTree/store_entity'

export const setActionStatusDone = (id) => ({
    type: ACTION_DONE,
    payload: id,
})

export const storeEntity = (id, value) => ({
    type: STORE_ENTITY,
    payload: { id, value },
})

export const selectEntity = (state, id) => (
    state.fetchTree != null
    && state.fetchTree.entities != null
    && state.fetchTree.entities[id]
)

export const selectIsReady = (state, id) => Boolean(
    state.fetchTree != null
    && state.fetchTree.ready != null
    && state.fetchTree.ready[id] != null
)


function readyReducer(state = {}, action) {
    if (action.type === ACTION_DONE) {
        return {
            ...state,
            [action.payload]: true,
        }
    }
    return state
}

function entityReducer(state = {}, action) {
    if (action.type === STORE_ENTITY) {
        const { id, value } = action.payload
        return {
            ...state,
            [id]: value,
        }
    }
    return state
}


const defaultState = {
    ready: readyReducer(undefined, { type: '__init__' }),
    entities: entityReducer(undefined, { type: '__init__' }),
}

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case ACTION_DONE:
            return {
                ...state,
                ready: readyReducer(state.ready, action),
            }
        case STORE_ENTITY:
            return {
                ...state,
                entities: entityReducer(state.entities, action),
            }

        default:
            return state
    }
}
