import React from 'react'
import fetchTree, { group, fromProps, depends } from 'fetch-tree'
import { todoResource } from './../resources'

function LeafA(props) {
    return (
        <div>
            {`LeafA props: ${JSON.stringify(props, undefined, 2)}`}
        </div>
    )
}

LeafA.displayName = 'LeafA'
LeafA.propTypes = {
    data: React.PropTypes.object.isRequired,
    branchId: React.PropTypes.number,
}

export default fetchTree({
    // This is *not* a connected component. We have defined a recommended method
    // of gathering the todo object, but it still has to be passed.
    connected: false,
    component: LeafA,
    resourceGroup: group({
        id: fromProps('id'),
        data: depends(['id'], todoResource),
    }),
})
