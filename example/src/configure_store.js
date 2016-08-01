import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer'

export default function configureStore() {
    const store = createStore(
        reducer,
        undefined,
        compose(
            applyMiddleware(
                thunk
            ),
            global.devToolsExtension ? global.devToolsExtension() : f => f
        )
    )

    return store
}
