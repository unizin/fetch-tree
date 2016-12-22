import React from 'react'
import fetchTree, { group, fromProps, virtual, child } from 'fetch-tree'

import Todo from './todo'
import TodoList from '../components/todo-list'


export default fetchTree({
    component: TodoList,
    resourceGroup: group({
        ids: fromProps('ids'),
        preloader: virtual(child(
            ['ids'],
            (ids) => ids.map(id => (
                <Todo id={id} />
            ))
        )),
    }),
})
