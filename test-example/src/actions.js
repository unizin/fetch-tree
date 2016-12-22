import api from './api'

export const fetchTodo = (id) => (dispatch) => {
    return api.fetchTodo(id).then(todo => {
        dispatch({
            type: 'SET_TODO',
            payload: todo,
            meta: { id },
        })
    })
}

export const incrementCount = () => ({
    type: 'INCREMENT_COUNT',
})
