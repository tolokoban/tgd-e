import React from "react"
import Theme from "@/ui/theme"
import Style from "./Button.module.css"
import { Circumference, OpaqueColorName } from "../../theme/styles/types"
import { ColorStyleProps, styleColorVars } from "../../theme/styles/color"
import { SpaceStyleProps, styleSpace } from "../../theme/styles/space"
import { DisplayStyleProps, styleDisplay } from "../../theme/styles/display"
import {
    DimensionStyleProps,
    styleDimension,
} from "../../theme/styles/dimension"
import {
    cssForColor,
    cssForColorOn,
    cssForGaps,
} from "../../theme/styles/styles"

const $ = Theme.classNames

export type ButtonProps = {
    className?: string
    /**
     * Default to __filled__.
     */
    type?: "elevated" | "filled" | "outlined" | "text"
    children: React.ReactNode
    onClick(this: void): void
    enabled?: boolean
    borderRadius?: Circumference
    color?: OpaqueColorName
    margin?: Circumference
    padding?: Circumference
} & DimensionStyleProps

function Button({
    className,
    children,
    onClick,
    enabled = true,
    borderRadius = ".5em",
    color = "secondary-5",
    margin = ["S", "M"],
    padding = [0, "M"],
    width = "auto",
    height = "2em",
    type = "elevated",
}: ButtonProps) {
    const style: React.CSSProperties = {
        "--custom-color-main-alpha": cssForColor(color, 0.5),
        "--custom-color-main": cssForColor(color),
        "--custom-color-text": cssForColorOn(color),
        margin: cssForGaps(margin),
        width,
        height,
        borderRadius: cssForGaps(borderRadius),
    }
    return (
        <button
            style={style}
            className={$.join(className, Style.Button, Style[type])}
            disabled={!enabled}
            type="button"
            onClick={onClick}
        >
            {(type === "filled" || type === "elevated") && (
                <div className={Style.glow}></div>
            )}
            <div
                className={Style.content}
                style={{
                    ...styleDimension({ width, height }),
                    borderRadius: cssForGaps(borderRadius),
                    padding: cssForGaps(padding),
                }}
            >
                {children}
            </div>
        </button>
    )
}

export function makeCustomButton(
    defaultProps: Partial<ButtonProps>
): (props: ButtonProps) => JSX.Element {
    return (props: ButtonProps) =>
        Button({
            ...defaultProps,
            ...props,
        })
}

export default Button
