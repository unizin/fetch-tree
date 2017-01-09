import { combineReducers } from 'redux'
import { reducer as fetchTree } from 'fetch-tree'

function todos(state = {}, action) {
    switch (action.type) {
        case 'SET_TODO': {
            return {
                ...state,
                [action.meta.id]: action.payload,
            }
        }
        default:
            return state
    }
}

function count(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT_COUNT':
            return state + 1
        default:
            return state
    }
}

export default combineReducers({
    currentUsername: 'bob',
    todos,
    count,
    fetchTree,
})


export const selectTodo = (state, id) => state.todos[id]

export const selectCount = (state) => state.count

export const selectCurrentUsername = (state) => state.currentUsername
