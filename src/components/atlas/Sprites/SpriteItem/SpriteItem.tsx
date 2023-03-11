import React from "react"
import Theme from "../../../../ui/theme"
import Style from "./SpriteItem.module.css"
import { TgdAtlasSprite, TgdSpriteBounds } from "../../../../format/atlas/atlas"
import IconChevronRight from "../../../../ui/view/icons/IconChevronRight"

const $ = Theme.classNames

export interface SpriteItemProps {
    className?: string
    sprite: TgdAtlasSprite
    selected: boolean
    onSelection(bounds: TgdSpriteBounds | null): void
}

export default function SpriteItem({
    className,
    sprite,
    selected,
    onSelection,
}: SpriteItemProps) {
    const handleSelection = () => {
        onSelection(selected ? null : { ...sprite })
    }
    return (
        <div
            className={$.join(
                className,
                Style.SpriteItem,
                selected ? Style.Selected : ""
            )}
        >
            <button onClick={handleSelection}>
                <IconChevronRight />
                <div>{sprite.id}</div>
            </button>
        </div>
    )
}
