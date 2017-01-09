import React from 'react'
import fetchTree, { group, fromProps, depends } from 'fetch-tree'
import { todoResource } from './../resources'

function Todo(props) {
    return (
        <div>
            {`id: ${props.id}`}
            <input
                type="checkbox"
                checked={props.todo.done}
            />
            <p>
                {props.todo.note}
            </p>
        </div>
    )
}

Todo.displayName = 'Todo'
Todo.propTypes = {
    id: React.PropTypes.number.isRequired,
    todo: React.PropTypes.shape({
        done: React.PropTypes.bool.isRequired,
        note: React.PropTypes.string.isRequired,
    }).isRequired,
}

export default fetchTree({
    // This is *not* a connected component. We have defined a recommended method
    // of gathering the todo object, but it still has to be passed.
    connected: false,
    component: Todo,
    resourceGroup: group({
        id: fromProps('id'),
        todo: depends(['id'], todoResource),
    }),
})
