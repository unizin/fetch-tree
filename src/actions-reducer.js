export const ACTION_DONE = '@@fetchTree/action_done'
export const STORE_ENTITY = '@@fetchTree/store_entity'
export const REFRESH_CACHE = '@@fetchTree/refresh_cache'

export const setActionStatusDone = (id) => ({
    type: ACTION_DONE,
    payload: id,
})

export const storeEntity = (id, value) => ({
    type: STORE_ENTITY,
    payload: { id, value },
})

export const refreshCache = () => ({ type: REFRESH_CACHE })

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

export const selectCacheKey = (state) => (
    (state.fetchTree != null)
        ? state.fetchTree.cacheKey
        : 0
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
    cacheKey: 0,
    ready: readyReducer(undefined, { type: '__init__' }),
    entities: entityReducer(undefined, { type: '__init__' }),
}

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case REFRESH_CACHE:
            return {
                ...state,
                cacheKey: state.cacheKey + 1,
            }
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
