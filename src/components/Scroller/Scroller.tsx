import React from "react"
import Theme from "../../ui/theme"
import Style from "./Scroller.module.css"
import Gesture, { PanEvent } from "../../utils/gesture"

const $ = Theme.classNames

export interface ScrollerProps {
    className?: string
    children: JSX.Element
}

export default function Scroller({ className, children }: ScrollerProps) {
    const refGesture = React.useRef<Gesture | null>(null)
    const handleMount = (div: HTMLDivElement | null) => {
        if (!div) return

        const child = div.querySelector("*")
        if (!child) throw Error("Unable to find a child for <Scroller>!")

        const gesture = new Gesture(child as HTMLElement | SVGElement)
        refGesture.current = gesture
        gesture.eventPan.addListener((evt: PanEvent) => {
            div.scrollLeft -= evt.deltaX
        })
    }
    React.useEffect(() => {
        return () => refGesture.current?.detach()
    })
    return (
        <div className={$.join(className, Style.Scroller)} ref={handleMount}>
            {children}
        </div>
    )
}
