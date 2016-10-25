# fetch-tree

The goal is to allow you to define data requirements with your components. Those
data requirements can then be composed so that a top level component can load
all of the required data for it and its children.

You define data requirements using a set of functions that generate nodes. Nodes
are plain objects with as few functions as I could get away with. If you log the
tree you built nodes will always have a `TYPE` property and many have a
`children` property.

This project was inspired by [redux-loader][redux-loader].

## Getting Started

FetchTree requires that you are using `redux`, `react-redux`, and `redux-thunk`.

```
npm install --save fetch-tree
```

Mix the reducer into your root reducer under the key `fetchTree`

```
import { reducer as fetchTree }  from 'fetch-tree'

export default combineReducers({
    fetchTree,
})
```

The default export is a function for generating a higher order component.

```js
import fetchTree from 'fetch-tree'

export const resources = /* */

export default fetchTree({
    resources,
    component: MyComponent,
    // busy is optional. If you don't provide a component it will just render
    // `null` in place of your component while it loads.
    busy: (props) => (<div>Loading...</div>),
})
```

## Resource nodes

The most important node types are:

1. `selector(selectFunction)` - Wraps an ordinary selector to pull data from your store
3. `loader({ id, action, selector, lazy = false })` - Allows you to manage how and where actions are fetched.
2. `entity({ id, apiFunction })` - You provide a function to call to fetch data and store it
  * `entity` is actually a shortcut for `loader` where `fetch-tree` provides the action and selector

Everything else exists to organize these three nodes.

### selector(selectorFunction(state, ...params))

Selectors are the easiest type to use. Other nodes that accept a child node will
allow you to pass a selector function and it will just convert it.

`...params` are optional and will be provided by the `depends()` node.

```js
const someSelector = (state) => state.thing
const resources = group({
    someProp: selector(someSelector)

    // automatically converted by group():
    otherProp: someSelector
})
```

### loader({ id, action, selector, lazy = false })

`fetch-tree` needs an ID to keep track of pending and completed requests. We do
that with an `id(...params)` function. If you have a resource that loads
individual todos by ID you might use

```js
id: (todoId) => `todo-${todoId}`
```

`action` must be a `thunk` style action that returns a promise that resolves
when the data has been written to the store.

`selector` must select whatever data `action` wrote to the store.

```js
loader({
    id: (...params) => `resource-type-`
    action: (...params) => (dispatch) => return new Promise((resolve, reject) => {

    })
    selector: (state, ...params) =>
})
```

### entity({ id, apiFunction })

`entity` is a special version of `loader` that replaces `action` and `selector`
with a single `apiFunction`. `apiFunction` needs to return a `Promise` for
whatever data you want to store under that key.


### group({ [propName]: node, [propName]: node })

`group` converts each `node` to a value. The most common use for this is as
`resources` for a component. Every key that where the node is ready becomes a
prop that will be passed down to your component.

```js
const resources = group({
    someProp: /* node definition */
})
```

It's best to define groups with an object literal, because it's going to
process each node in order.

As `group` processes, each node becomes known as a `resource` that you may
depend on for other nodes.

### group([ node, node, node ])

When `group` is given an array, it will return an array with the values of each
node.

### group(factory)

When `group` is given a factory function, it allows you to generate a group while the FetchTree is being processed.
`factory` is given any `depends` parameters (much like `selector` and `loader`), which is useful for creating a group that
depends on component properties, or loaded values of other resources.

```js
const todoLoader = loader(/* assume it needs an ID */)

const resources = group({
    allTodos: depends(
        [fromProps('ids')],
        group((ids) => ids.map(
            id => depends([ () => id ], todoLoader)
        ))
    ),
})
```

### depends(dependencies, child)

This node populates `...params` for its child node. `dependencies` is an
array of nodes and dot-separated paths referring to other resources in this group.

```js
const resources = group({
    resourceA: selectA,
    resourceB: selectB,

    depends(
        [
            'resourceA',
            'resourceB.name',
            fromProps('componentProperty'),
            (state) => state.someProperty
            () => 'some hardcoded value'
        ],
        selector((state, resourceA, resourceBName, componentProperty, hardcodedValue) => {
        })
    )
})
```

### virtual(child)

`virtual` allows you to define resources in a `group` that don't get passed
along as props in your component.

```js
const resources = group({
    notAProp: virtual(selector(someSelector)),

    someProp: depends(
        ['notAProp'],
        selector((state, notAPropValue) => {

        })
    )
})
```

### fromProps(propPath)

`fromProps` usually (see `withProps`) references the props given to your component connected with FetchTree. `propPath` is dot-separated path.

```
const resources = group({
    todos: depends(
        fromProps('category.todoId'),
        todoLoader
    )
})
```

## withProps(props, node)

`withProps` sets the props used by `fromProps`.  This is usually set for you using your connected component's props by the FetchTree higher order component
but can be useful to set yourself. For example, `withProps` can be used to "preload" resources, that is, to cause some parent component to be considered "loading" until a
cache has been prepared for the children it renders.

```js

const todoResource = group({
    todo: depends( [fromProps('id')], todoLoader )
})

const todoListResource = group({
    todos: depends(
        [fromProps('ids')],
        group((ids) => {
            return ids.map(
                id => withProps({ id }, childTree)
            )
        })
    ),
})

```

### debug(child)

You can wrap nodes in `debug` to log that section of the tree, and to log what's
happening as it gets processed.

`group.debug(children)` is a shortcut for `debug(group(children))`. This allows
you to quickly add and remove debugging without having to deal with parens that
might be many lines away.


## Open Source

This library is written for and maintained by Unizin. We offer it without
guarantees because it may be useful to your projects. All proposed contributions
to this repository are reviewed by Unizin.

## Goals

* manage all data for each component
* selecting data is as easy as loading data
* requirement trees can be composed
* debuggable
* Loading screen shows when the data hasn't arrived
* revisiting a component will show cached data, but will also fetch fresh data in the background

[redux-loader]: https://github.com/Versent/redux-loader/https://github.com/Versent/redux-loader/
