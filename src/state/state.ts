import { isString } from "@/utils/type-guards"
import AtomicState from "./atomic-state"

export default {
    name: new AtomicState("", {
        id: "Billy Jean",
        guard: isString,
    }),
}
