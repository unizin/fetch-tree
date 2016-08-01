import React from 'react'
import Story from './story.jsx'


export default function Timeline(props) {
    const { username, timeline } = props

    timeline.map(id => console.log('id: ', id))
    const tmp = timeline.map(id => <Story key={id} id={id} />)

    console.log('tmp: ', tmp)

    return (
        <div>
            <h1>{username}</h1>
            <ul>
                {tmp}
            </ul>
        </div>
    )
}
