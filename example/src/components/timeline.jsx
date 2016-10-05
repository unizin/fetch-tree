import React from 'react'
import Timeline from './timeline.ui.jsx'
import { resources as storyResources } from './story.jsx'
import fetchTree, { depends, loader, group, virtual, withProps, fromProps } from 'fetch-tree'
import { fetchTimeline } from '../actions'
import { selectTimeline } from '../reducer'

let storiesPreload = depends( // eslint-disable-line prefer-const
    ['timeline'],
    virtual(group(ids => ids.map(
        id => withProps({ id }, storyResources)
    )))
)

// uncomment this to disable preloading.
// storiesPreload = () => null

const resources = group({
    username: fromProps('params.username'),
    timeline: depends(
        ['username'],
        loader({
            id(username) { return `timeline-${username}` },
            action: fetchTimeline,
            selector: selectTimeline,
        })
    ),

    storiesPreload,
})

export default fetchTree({
    component: Timeline,
    busy: () => <h1>Loading...</h1>,
    resources,
})
