import React from "react"
import Theme from "../../ui/theme"
import { ColorName } from "../../ui/theme/styles/types"
import IconChevronRight from "../../ui/view/icons/IconChevronRight"
import Style from "./TreeItem.module.css"

const $ = Theme.classNames

export interface TreeItemProps {
    className?: string
    label: string
    /** Default to "neutral-5" */
    color?: ColorName
    /** Default to false */
    expanded?: boolean
    children?: React.ReactNode
    onClick(expand: boolean): void
}

export default function TreeItem({
    className,
    label,
    color = "neutral-5",
    expanded = false,
    children,
    onClick,
}: TreeItemProps) {
    const handleSelection = () => {
        onClick(expanded)
    }
    return (
        <div
            className={$.join(className, Style.TreeItem)}
            style={{
                "--custom-color-back": `var(--theme-color-${color})`,
                "--custom-color-text": `var(--theme-color-on-${color})`,
            }}
        >
            <header>
                <button onClick={handleSelection}>
                    <IconChevronRight
                        className={$.join(
                            Style.chevron,
                            expanded && Style.chevronExpanded
                        )}
                    />
                    <div>{label}</div>
                </button>
            </header>
            {children && <main>{children}</main>}
        </div>
    )
}
