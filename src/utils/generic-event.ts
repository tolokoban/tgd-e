type Listener<T> = (value: T) => void

export default class GenericEvent<T> {
    private readonly listeners: Listener<T>[] = []

    addListener(listener: Listener<T>) {
        this.listeners.push(listener)
    }

    removeListener(listener: Listener<T>) {
        const index = this.listeners.indexOf(listener)
        if (index < 0) return

        this.listeners.splice(index, 1)
    }

    dispath(value: T) {
        for (const listener of this.listeners) {
            listener(value)
        }
    }
}
