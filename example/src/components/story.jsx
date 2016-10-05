import Story from './story.ui.jsx'
import fetchTree, { depends, loader, group, fromProps } from 'fetch-tree'
import { fetchStory } from '../actions'
import { selectStory } from '../reducer'

export const resources = group({
    id: fromProps('id'),
    story: depends(
        ['id'],
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
