/* eslint-env jest */
import React from 'react'
import td from 'testdouble'

import fetchTree, { group, fromProps, depends, virtual, debug } from 'fetch-tree'
import renderer from 'react-test-renderer'
import configureStore from '../src/configure_store'

const Dummy = () => null

const Component = fetchTree({
    component: Dummy,
    resourceGroup: group({
        number: fromProps('number'),
        id: fromProps('id'),
        propWithDefault: fromProps('optional', 'default'),

        nestedProp: fromProps('missingData.some.nested.data'),
        otherData: fromProps('missingData.other'),
        nestedWithDefault: fromProps('nested.withDefault', 'default'),

        foo: fromProps('data.foo'),

        hidden: depends(
            // This one will not be found because the scanner doesn't descend
            // into `depends` nodes. Best practice is to keep all of your
            // `fromProps` attached to the `group`.
            [fromProps('hiddenDependency')],
            (state, hiddenDependency) => state[hiddenDependency]
        ),

        virtual: virtual(fromProps('virtualProp')),
        debug: debug(virtual(fromProps('debugVirtual'))),
    }),
})


test(`propTypes are generated from any fromProps() attached to the resourceGroup`, () => {
    const errors = []
    td.replace(console, 'log')
    td.replace(console, 'error', (message) => errors.push(message))
    const store = configureStore()
    const data = { bar: 1 }
    renderer.create(<Component store={store} number={1} data={data} />)
    td.reset()

    expect(errors.shift() || "").toMatch(/^Warning:.*The prop `id`/)
    expect(errors.shift() || "").toMatch(/^Warning:.*The prop `missingData`/)
    expect(errors.shift() || "").toMatch(/^Warning:.*The prop `data.foo`/)
    expect(errors.shift() || "").toMatch(/^Warning:.*The prop `virtualProp`/)
    expect(errors.shift() || "").toMatch(/^Warning:.*The prop `debugVirtual`/)
    expect(errors.length).toBe(0)
})
