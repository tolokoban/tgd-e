import AtomicState from "./atomic-state"

export default {
    page: new AtomicState(""),
    tools: {
        atlas: {
            path: new AtomicState<string | null>(null),
        },
    },
}
