import React from "react"
import Theme from "@/ui/theme"
import Style from "./Terminal.module.css"
import MortyHappy from "@/svg/MortyHappy"
import RightThoughtful from "@/svg/RickThoughtful"

const $ = Theme.classNames

export interface TerminalProps {
    className?: string
    text: string
    actor: "thought" | "rational"
    /** Number of characters per second. Default to 20. */
    speed?: number
}

export default function Terminal({
    className,
    text,
    speed = 20,
    actor,
}: TerminalProps) {
    const refTimeout = React.useRef(0)
    const refLength = React.useRef(0)
    const [visibleText, setVisibleText] = React.useState("")
    const [invisibleText, setInvisibleText] = React.useState(text)
    React.useEffect(() => {
        const nextChar = () => {
            refLength.current++
            if (refLength.current >= text.length) {
                setVisibleText(text)
                setInvisibleText("")
                window.clearInterval(refTimeout.current)
                return
            }
            setVisibleText(text.substring(0, refLength.current))
            setInvisibleText(text.substring(refLength.current))
        }
        refTimeout.current = window.setInterval(nextChar, 1000 / speed)
        return () => window.clearInterval(refTimeout.current)
    })
    return (
        <div className={$.join(className, Style.Terminal)}>
            <article>
                <span className={Style.highlight}>{visibleText}</span>
                <span>{invisibleText}</span>
            </article>
            <footer>
                {actor === "rational" && <MortyHappy />}
                {actor === "thought" && <RightThoughtful />}
            </footer>
        </div>
    )
}
