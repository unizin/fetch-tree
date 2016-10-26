import withContext from './with-context'

export default function withProps(props, child) {
    return withContext('props', props, child)
}
