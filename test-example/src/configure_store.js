import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer'

export default function configureStore() {
    const store = createStore(
        reducer,
        undefined,
        applyMiddleware(
            thunk
        )
    )

    return store
}
