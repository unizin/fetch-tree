/* eslint-env jest */
import configureStore from '../src/configure_store'
import loadingRender from './../loading-render'

export async function renderSnapshot(actual, store = configureStore()) {
    const render = loadingRender(store)

    const results = await render(actual)

    // see __snapshots__ for the the HTML the component produced.
    expect(results.tree).toMatchSnapshot()
    return results
}
