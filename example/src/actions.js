import { getTimeline, getStory } from './api'

const delay = (ms) => (nextValue) => new Promise(resolve => {
    setTimeout(() => resolve(nextValue), ms)
})

export const fetchTimeline = (username) => (dispatch) => {
    const ms = Math.floor(Math.random() * 10) * 100

    return getTimeline(username).then(delay(ms)).then(timeline => dispatch({
        type: 'TIMELINE',
        payload: {
            username,
            timeline,
        },
    }))
}

export const fetchStory = (id) => (dispatch) => {
    const ms = Math.floor(Math.random() * 10) * 100

    return getStory(id).then(delay(ms)).then(story => dispatch({
        type: 'STORY',
        payload: story,
    }))
}
