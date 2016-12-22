import React from 'react'
import fetchTree, { group, fromProps, virtual, child } from 'fetch-tree'

import Todo from './todo'

const TodoWrapper = ({ id }) => (
    <span>
        <h1>Wrapper: {id}</h1>
        <Todo id={id} />
    </span>
)
TodoWrapper.propTypes = {
    id: React.PropTypes.number.isRequired,
}

export default fetchTree({
    component: TodoWrapper,
    resourceGroup: group({
        id: fromProps('id'),
        preloader: virtual(child(
            ['id'],
            (id) => (<Todo id={id} />)
        )),
    }),
})
