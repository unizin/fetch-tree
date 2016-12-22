import React from 'react'
import { connect } from 'react-redux'
import hoistStatics from 'hoist-non-react-statics'

import loaderContext from './loader_context'
import processor from './processor'
import withContext from './node_types/with-context'
import withProps from './node_types/with-props'
import withDispatch from './node_types/with-dispatch'
import { selectCacheKey } from './actions-reducer.js'
import { map, reduce } from './utils'

const getDisplayName = Component => (
  Component.displayName ||
  Component.name ||
  (typeof Component === 'string' ? Component : 'Component')
)


const contextShape = React.PropTypes.shape({
    execute: React.PropTypes.func.isRequired,
    hasExecuted: React.PropTypes.func.isRequired,
})

// These need to get passed as props and we need to avoid name conflicts with
// any props the user is passing through to Component. Using the dashes and
// colons ensures that we can't accidentally conflict with JSX props.
const IS_READY = '--loader:is-ready'
const ACTION_QUEUE = '--loader:action-queue'
const DISPATCH = '--loader:dispatch'
const DISPATCH_PROXY = '--loader:dispatchProxy'
const CACHE_KEY = '--loader:cacheKey'

function nonConnectedWrapper({ component: Component, resourceGroup }) {
    function NonConnectedFetchTree(props) {
        return <Component {...props} />
    }
    if (process.env.NODE_ENV !== 'production') {
        // We don't need any proptypes, but the wrapped component needs to not use
        // the child's propTypes.
        NonConnectedFetchTree.propTypes = {}
        NonConnectedFetchTree.displayName = `NonConnectedFetchTree(${getDisplayName(Component)})`
    }

    NonConnectedFetchTree.originalComponent = Component
    NonConnectedFetchTree.resourceGroup = resourceGroup
    return hoistStatics(NonConnectedFetchTree, Component)
}

export default function fetchTree(options) {
    const { connected = true, resourceGroup = options.resources } = options
    const { component: Component, busy: Busy } = options

    if (options.mapDispatchToProps) {
        throw new Error('mapDispatchToProps was removed. Use the dispatch node type instead')
    }

    if (process.env.NODE_ENV !== 'production' && options.resources) {
        console.log('The resources key has be deprecated and renamed resourceGroup') // eslint-disable-line no-console
    }

    if (Component.resourceGroup) {
        return fetchTree({
            ...options,
            resourceGroup: Component.resourceGroup,
            component: Component.originalComponent,
        })
    }

    if (resourceGroup) {
        if (resourceGroup.TYPE !== 'group') {
            if (resourceGroup && resourceGroup.TYPE === 'debug' && resourceGroup.child.TYPE === 'group') {
                // It's ok to wrap the group in a debug node
            } else {
                throw new Error('resourceGroup must be a `group()`')
            }
        }
    } else {
        throw new Error('resourceGroup is required')
    }

    if (!connected) {
        return nonConnectedWrapper(options)
    }

    class LoaderComponent extends React.Component {
        static resourceGroup = resourceGroup
        static originalComponent = Component

        static childContextTypes = {
            loaderContext: contextShape,
        }

        static contextTypes = {
            loaderContext: contextShape,
            testMonitor: React.PropTypes.shape({
                setStatus: React.PropTypes.func.isRequired,
                unregister: React.PropTypes.func.isRequired,
            }),
        }

        constructor(props, context) {
            super(props, context)
            this.loaderContext = loaderContext(context.loaderContext)
            const {
                [DISPATCH]: dispatch,
                [DISPATCH_PROXY]: dispatchProxy,
            } = props
            dispatchProxy.dispatch = dispatch
        }

        getChildContext() {
            return {
                loaderContext: this.loaderContext,
            }
        }

        componentDidMount() {
            this.afterRender()
        }

        componentWillReceiveProps(nextProps) {
            const {
                [DISPATCH]: dispatch,
                [DISPATCH_PROXY]: dispatchProxy,
            } = nextProps
            dispatchProxy.dispatch = dispatch
        }

        componentDidUpdate() {
            this.afterRender()
        }

        componentWillUnmount() {
            if (this.context.testMonitor && process.env.NODE_ENV !== 'production') {
                this.context.testMonitor.unregister(this)
            }
        }

        afterRender = () => {
            const {
                [IS_READY]: isReady,
                [ACTION_QUEUE]: actionQueue,
                [DISPATCH]: dispatch,
                [CACHE_KEY]: cacheKey,
            } = this.props
            this.loaderContext.execute(dispatch, actionQueue, cacheKey)
            if (this.context.testMonitor && process.env.NODE_ENV !== 'production') {
                this.context.testMonitor.setStatus(this, isReady)
            }
        }

        render() {
            const {
                [IS_READY]: isReady,
                [ACTION_QUEUE]: ignoredActionQueue,
                [DISPATCH]: ignoredDispatch,
                [DISPATCH_PROXY]: ignoredDispatchProxy,
                [CACHE_KEY]: ignoredCacheCounter,
                ...props
            } = this.props

            if (!isReady) {
                if (Busy) {
                    return (<Busy />)
                }

                return (<noscript></noscript>)
            }

            return (
                <Component {...props} />
            )
        }
    }
    if (process.env.NODE_ENV !== 'production') {
        LoaderComponent.displayName = `FetchTree(${getDisplayName(Component)})`
        let group = resourceGroup
        if (group.TYPE === 'debug') {
            group = group.child
        }

        const mergePropShape = (propPaths, node) => {
            if (node.TYPE === 'virtual' || node.TYPE === 'debug') {
                return mergePropShape(propPaths, node.child)
            }

            if (node.TYPE === 'fromProps') {
                const path = node.path.split('.')
                const propName = path.shift()

                propPaths[propName] = propPaths[propName] || {}
                if (path.length > 0) {
                    path.reduce((current, path) => {
                        current[path] = current[path] || {}
                        return current[path]
                    }, propPaths[propName])
                }
            }

            return propPaths
        }
        // This produces a tree of objects representing all known props.
        const propPaths = reduce(group.children, mergePropShape, {})

        LoaderComponent.propTypes = map(propPaths, function makeProptype(tmp) {
            if (Object.keys(tmp).length === 0) {
                return React.PropTypes.any.isRequired
            }

            return React.PropTypes.shape(
                map(tmp, makeProptype)
            ).isRequired
        })
    }

    function mapStateToProps() {
        // Each instance gets its own `dispatchProxy` function that never changes
        const dispatchProxy = (action) => {
            // dispatchProxy.dispatch will get attached in the component's constructor
            // and updated in componentWillReceiveProps
            if (!dispatchProxy.dispatch) {
                throw new Error(`Dispatch can't be called yet`)
            }
            return dispatchProxy.dispatch(action)
        }

        return (state, props) => {
            const cacheKey = selectCacheKey(state)
            const localResources = withContext('path', [LoaderComponent.displayName || 'Component'],
                withProps(props,
                    withDispatch(dispatchProxy, resourceGroup)
                )
            )
            const { isReady, actionQueue, value } = processor(localResources, state)

            return {
                ...value,
                [IS_READY]: isReady,
                [ACTION_QUEUE]: actionQueue,
                [DISPATCH_PROXY]: dispatchProxy,
                [CACHE_KEY]: cacheKey,
            }
        }
    }

    const mapDispatch = {
        [DISPATCH]: (action) => action,
    }

    return connect(mapStateToProps, mapDispatch)(
        hoistStatics(LoaderComponent, Component)
    )
}
