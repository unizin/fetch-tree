import React from 'react'
import fetchTree, { group, fromProps, depends } from 'fetch-tree'
import { todoResource } from './../resources'

function LeafB(props) {
    return (
        <div>
            {`LeafB props: ${JSON.stringify(props, undefined, 2)}`}
        </div>
    )
}

LeafB.displayName = 'LeafB'
LeafB.propTypes = {
    data: React.PropTypes.object.isRequired,
}

export default fetchTree({
    // This is *not* a connected component. We have defined a recommended method
    // of gathering the todo object, but it still has to be passed.
    connected: false,
    component: LeafB,
    resourceGroup: group({
        id: fromProps('id'),
        data: depends(['id'], todoResource),
    }),
})
