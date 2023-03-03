import AtomicState from "./atomic-state"

export default {
    tools: {
        atlas: {
            imageSource: new AtomicState<string | null>(null),
        },
    },
}
