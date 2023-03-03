import React from "react"

export interface AtomicStateStorageOptions<T> {
    id: string
    guard: (data: unknown) => data is T
}

export default class AtomicState<T> {
    private static counter = 0
    private currentValue: T
    private readonly listeners = new Set<(value: T) => void>()
    private readonly id: string
    private readonly sessionId = `AtomicState:${(AtomicState.counter++).toString(
        16
    )}\r`

    constructor(
        initialValue: T,
        private readonly storage?: AtomicStateStorageOptions<T>
    ) {
        this.currentValue = initialValue
        this.id = `AtomicState\n${storage?.id}`
        if (storage) this.loadFromStorage()
        else {
            this.restoreSession()
        }
    }

    get value() {
        return this.currentValue
    }
    set value(value: T) {
        if (value === this.currentValue) return

        this.currentValue = value
        if (this.storage)
            window.localStorage.setItem(this.id, JSON.stringify(value))
        else this.saveSession(value)
        for (const listener of this.listeners) {
            listener(value)
        }
    }

    useValue(): T {
        const [value, setValue] = React.useState(this.currentValue)
        React.useEffect(() => {
            this.listeners.add(setValue)
            return () => {
                this.listeners.delete(setValue)
            }
        }, [])
        return value
    }

    useState(): [value: T, setValue: (value: T) => void] {
        const [value, setValue] = React.useState(this.currentValue)
        React.useEffect(() => {
            this.listeners.add(setValue)
            return () => {
                this.listeners.delete(setValue)
            }
        }, [])
        return [
            value,
            (v: T) => {
                this.value = v
            },
        ]
    }

    private loadFromStorage() {
        const { storage } = this
        if (!storage) return

        try {
            const text = window.localStorage.getItem(this.id)
            if (!text) return

            const data = JSON.parse(text)
            if (!storage.guard(data)) throw Error(`Invalid type!`)

            this.currentValue = data
        } catch (ex) {
            console.error(`Unable to retrieve AtomicState "${storage.id}":`, ex)
        }
    }

    private saveSession(value: T) {
        const text = JSON.stringify(value)
        const hash = computeHash(text)
        window.sessionStorage.setItem(this.sessionId, `${hash}${text}`)
    }

    private restoreSession() {
        const content = window.sessionStorage.getItem(this.sessionId)
        if (!content) return

        const hash = content.substring(0, 16)
        const text = content.substring(16)
        if (computeHash(text) !== hash) {
            console.error("Atomic state has been corrupted!", this.sessionId)
            return
        }

        try {
            const data = JSON.parse(text) as T
            this.value = data
        } catch (ex) {
            console.error("Atomic state is an invalid JSON!", this.sessionId)
        }
    }
}

const DIGITS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

function computeHash(content: string): string {
    const digits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (let i = 0; i < content.length; i++) {
        const c = content.charCodeAt(i)
        digits[i % digits.length] += c
    }
    return digits.map(v => DIGITS[v % DIGITS.length]).join("")
}
