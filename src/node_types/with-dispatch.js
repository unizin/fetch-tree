import withContext from './with-context'

export default function withDispatch(dispatch, child) {
    return withContext('dispatch', dispatch, child)
}
