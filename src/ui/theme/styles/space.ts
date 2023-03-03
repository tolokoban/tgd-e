import { cssForGaps } from "./styles"
import { Circumference } from "./types"

export interface SpaceStyleProps {
    borderRadius?: Circumference
    margin?: Circumference
    padding?: Circumference
}

export function styleSpace({ borderRadius, margin, padding }: SpaceStyleProps) {
    const style: React.CSSProperties = {}
    if (borderRadius) style.borderRadius = cssForGaps(borderRadius)
    if (margin) style.margin = cssForGaps(margin)
    if (padding) style.padding = cssForGaps(padding)
    return style
}
