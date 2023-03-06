import AtomicState from "./atomic-state"

export default {
    page: new AtomicState(""),
    tools: {
        atlas: {
            imagePath: new AtomicState<string | null>(null),
        },
    },
}
