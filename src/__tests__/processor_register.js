import { register } from '../processor'

// This registers group into the processor.
import '../node_types/group'

function processorError(t, errorRegex, node) {
    expect(() => register(node)).toThrowError(errorRegex)
}
processorError.title = (providedTitle, regex) => `error: ${regex}`

const TYPE = 'RegistrationTest'
it(processorError, /missing TYPE/, {})
it(processorError, /missing factory/, { TYPE })
it(processorError, /missing nodeProcessor/, { TYPE, factory() {} })

// group already exists:
it(processorError, /already registered/, { TYPE: 'group', factory() {}, nodeProcessor() {} })
