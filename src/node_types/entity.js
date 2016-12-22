import loader from './loader'
import { storeEntity, selectEntity } from '../actions-reducer'

export const entityAction = (id, promise) => (dispatch) => {
    return promise.then((value) => dispatch(storeEntity(id, value)))
}

export default function factory(options = {}) {
    const { id, apiFunction } = options
    if (typeof id !== 'function') {
        throw new Error(`id must be a function`)
    }
    if (typeof apiFunction !== 'function') {
        throw new Error(`apiFunction must be a function`)
    }

    return loader({
        id,
        action: (...args) => entityAction(id(...args), apiFunction(...args)),
        selector: (state, ...args) => selectEntity(state, id(...args)),
    })
}
