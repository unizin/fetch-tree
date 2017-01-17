let mockedNodes
export const hasMocks = () => mockedNodes != null
export const resetMocks = () => { mockedNodes = undefined }
export const hasMock = (node) => hasMocks() && mockedNodes.has(node)

export function registerMock(node, mock) {
    if (!hasMocks()) {
        mockedNodes = new WeakMap()
    }
    mockedNodes.set(node, mock)
}

export function getMock(node) {
    if (process.env.NODE_MODULES !== 'production') {
        if (hasMocks() && mockedNodes.has(node)) {
            return mockedNodes.get(node)
        }
    }
    return node
}
