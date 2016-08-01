

const TYPE = 'preload'

export default function preload(factory) {
    return {
        TYPE,
        factory,
    }
}

preload.TYPE = TYPE

preload.useProps = (function useProps() {
    const TYPE = 'useProps'
    function useProps(props, child) {
        return {
            TYPE,
            props,
            child,
        }
    }
    useProps.TYPE = TYPE
    return useProps
}())
