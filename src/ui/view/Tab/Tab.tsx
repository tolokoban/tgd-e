import React from "react"
import Theme from "../../theme"
import Style from "./Tab.module.css"

const $ = Theme.classNames

export interface TabProps {
    className?: string
    label: string | JSX.Element
    children: React.ReactNode
}

export default function Tab({ className, children }: TabProps) {
    return <div className={$.join(className, Style.Tab)}>{children}</div>
}
