import fetchTree from 'fetch-tree'

import Todo from '../components/todo'
import Loading from '../components/loading'

export default fetchTree({
    component: Todo,
    busy: Loading,
})
