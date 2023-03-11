import { extend } from "colord"
import GenericEvent from "./generic-event"

export interface TapEvent {
    x: number
    y: number
}

export interface PanEvent extends TapEvent {
    x0: number
    y0: number
    time0: number
    time: number
    deltaX: number
    deltaY: number
}

export default class Gesture {
    public eventTap = new GenericEvent<TapEvent>()
    public eventDoubleTap = new GenericEvent<TapEvent>()
    public eventPan = new GenericEvent<PanEvent>()

    private tapDuration = 400
    private element: HTMLElement | SVGElement | null = null
    private down = false
    private downX = 0
    private downY = 0
    private downT = 0
    private moveX = 0
    private moveY = 0
    private moveT = 0
    private tapT = 0

    constructor(element: HTMLElement | SVGElement) {
        this.attach(element)
    }

    attach(element: HTMLElement | SVGElement) {
        this.detach()
        this.element = element
        element.addEventListener("pointerdown", this.handleDown)
        element.addEventListener("pointermove", this.handleMove)
        element.addEventListener("pointerup", this.handleUp)
        element.addEventListener("pointercancel", this.handleCancel)
    }

    detach() {
        const { element } = this
        if (!element) return

        this.element = null
        element.removeEventListener("pointerdown", this.handleDown)
        element.removeEventListener("pointermove", this.handleMove)
        element.removeEventListener("pointerup", this.handleUp)
        element.removeEventListener("pointercancel", this.handleCancel)
    }

    private readonly handleDown = (evt: PointerEvent) => {
        this.element.setPointerCapture(evt.pointerId)
        const [x, y] = this.coords(evt)
        this.downX = x
        this.downY = y
        this.downT = evt.timeStamp
        this.down = true
    }

    private readonly handleMove = (evt: PointerEvent) => {
        const [x, y] = this.coords(evt)
        const time = evt.timeStamp
        if (this.down) {
            this.eventPan.dispath({
                x,
                y,
                time,
                x0: this.downX,
                y0: this.downY,
                time0: this.downT,
                deltaX: x - this.moveX,
                deltaY: y - this.moveY,
            })
        }
        this.moveX = x
        this.moveY = y
        this.moveT = evt.timeStamp
    }

    private readonly handleUp = (evt: PointerEvent) => {
        this.handleMove(evt)
        this.down = false
        const [x, y] = this.coords(evt)
        const time = evt.timeStamp
        if (time - this.downT < this.tapDuration) {
            // This is a tap!
            if (this.downT - this.tapT < this.tapDuration) {
                // This is a DOUBLE tap.
                this.eventDoubleTap.dispath({ x, y })
            } else {
                // This is a SINGLE tap.
                this.eventTap.dispath({ x, y })
            }
            this.tapT = time
        }
        this.element.releasePointerCapture(evt.pointerId)
    }

    private readonly handleCancel = (evt: PointerEvent) => {
        this.handleUp(evt)
    }

    private coords(evt: PointerEvent) {
        const rect = this.element.getBoundingClientRect()
        const x = evt.pageX - rect.x
        const y = evt.pageY - rect.y
        return [x, y]
    }
}
