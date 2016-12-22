import React from 'react'
import TodoContainer from '../containers/todo'

export default function TodoList(props) {
    return (
        <ul>
            {props.ids.map(id => (
                <li key={id}>
                    <TodoContainer id={id} />
                </li>
            ))}
        </ul>
    )
}
TodoList.propTypes = {
    ids: React.PropTypes.arrayOf(
        React.PropTypes.number.isRequired,
    ).isRequired,
}
