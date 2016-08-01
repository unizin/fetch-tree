import React from 'react'
import Story from './story.ui.jsx'
import fetchTree, { depends, loader, group } from 'fetch-tree'
import { fetchStory } from '../actions'
import { selectStory } from '../reducer'

export const resources = group({
    story: depends(
        [depends.prop('id')],
        loader({
            id(id) { return `story-${id}` },
            action: fetchStory,
            selector: selectStory,
        })
    ),
})

export default fetchTree({
    component: Story,
    resources,
})
