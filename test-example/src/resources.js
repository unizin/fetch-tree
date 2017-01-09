import { loader, entity } from 'fetch-tree'
import { fetchTodo } from './actions'
import { selectTodo } from './reducer'
import api from './api'

export const todoResource = loader({
    id: (id) => `todo-${id}`,
    action: fetchTodo,
    selector: selectTodo,
})

export const branchResource = entity({
    id: (id) => `branch-${id}`,
    apiFunction: api.fetchBranch,
})

export const userResource = entity({
    id: (id) => `user-${id}`,
    apiFunction: api.fetchUser,
})
