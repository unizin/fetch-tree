import React from 'react'

export default function Story({ story }) {
    return (
        <li>
            {story.name}: {story.content}
        </li>
    )
}
