import test from 'ava'
import { register } from '../processor'

// This registers group into the processor.
import '../node_types/group'

function processorError(t, errorRegex, node) {
    t.throws(() => register(node), errorRegex)
}
processorError.title = (providedTitle, regex) => `error: ${regex}`

const TYPE = 'RegistrationTest'
test(processorError, /missing TYPE/, {})
test(processorError, /missing factory/, { TYPE })
test(processorError, /missing nodeProcessor/, { TYPE, factory() {} })

// group already exists:
test(processorError, /already registered/, { TYPE: 'group', factory() {}, nodeProcessor() {} })
