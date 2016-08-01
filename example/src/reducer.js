import { combineReducers } from 'redux'
import { reducer as fetchTree } from 'fetch-tree'

const timelines = (state = {}, action) => {
    if (action.type === 'TIMELINE') {
        const { username, timeline } = action.payload
        return {
            ...state,
            [username]: timeline,
        }
    }
    return state
}

const stories = (state = {}, action) => {
    if (action.type === 'STORY') {
        const story = action.payload
        return {
            ...state,
            [story.id]: story,
        }
    }
    return state
}

export default combineReducers({
    timelines,
    stories,
    fetchTree,
})

export const selectTimeline = (state, username) => state.timelines[username]

export const selectStory = (state, id) => state.stories[id]
