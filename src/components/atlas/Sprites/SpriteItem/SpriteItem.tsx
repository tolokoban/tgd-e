import React from "react"
import { TgdAtlasSprite, TgdSpriteBounds } from "../../../../format/atlas/atlas"
import Theme from "../../../../ui/theme"
import InputText from "../../../../ui/view/InputText"
import InputInteger from "../../../../ui/view/InputInteger"
import TreeItem from "../../../TreeItem"
import Style from "./SpriteItem.module.css"

const $ = Theme.classNames

export interface SpriteItemProps {
    className?: string
    sprite: TgdAtlasSprite
    selected: boolean
    image: HTMLImageElement | HTMLCanvasElement | null
    onSelection(bounds: TgdSpriteBounds | null): void
    onUpdate(sprite: TgdAtlasSprite): void
}

export default function SpriteItem({
    className,
    sprite,
    selected,
    image,
    onSelection,
    onUpdate,
}: SpriteItemProps) {
    const [centerX, setCenterX] = React.useState(
        Math.round(sprite.centerX * sprite.width)
    )
    const [centerY, setCenterY] = React.useState(
        Math.round(sprite.centerY * sprite.height)
    )
    const [name, setName] = React.useState(sprite.id)
    const handleSelection = () => {
        onSelection(selected ? null : { ...sprite })
    }
    const handleEnterPressed = (newSpriteName: string) => {
        onUpdate({
            ...sprite,
            id: newSpriteName,
        })
    }
    const paintSprite = usePaintSpriteCallback(sprite, image)
    return (
        <TreeItem
            className={$.join(className, Style.SpriteItem)}
            color={selected ? "primary-5" : "neutral-5"}
            expanded={selected}
            label={sprite.id}
            onClick={handleSelection}
        >
            {selected && (
                <>
                    <InputText
                        label="nom du sprite (Enter pour valider)"
                        value={name}
                        autofocus={true}
                        onChange={setName}
                        onEnterKeyPressed={handleEnterPressed}
                        validator={text => text.trim().length > 0}
                    />
                    {image && (
                        <div className={Style.grid}>
                            <canvas ref={paintSprite}></canvas>
                            <div>
                                <InputInteger
                                    label="Center X"
                                    value={centerX}
                                />
                            </div>
                            <div>
                                <InputInteger
                                    label="Center Y"
                                    value={centerY}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}
        </TreeItem>
    )
}
function usePaintSpriteCallback(
    sprite: TgdAtlasSprite,
    image: HTMLImageElement | HTMLCanvasElement
) {
    return (destination: HTMLCanvasElement | null) => {
        if (!destination) return

        const ctx = destination.getContext("2d")
        if (!ctx) return

        const MARGIN = 10
        const srcX = sprite.left
        const srcY = sprite.top
        const srcW = sprite.width
        const srcH = sprite.height
        const dstX = MARGIN
        const dstY = MARGIN
        const dstW = srcW + 2 * dstX
        const dstH = srcH + 2 * dstY
        destination.style.width = `${dstW}px`
        destination.style.height = `${dstH}px`
        destination.width = dstW
        destination.height = dstH
        ctx.clearRect(0, 0, dstW, dstH)
        ctx.drawImage(image, srcX, srcY, srcW, srcH, dstX, dstY, srcW, srcH)
        const xc = dstX + srcW * sprite.centerX
        const yc = dstY + srcH * sprite.centerY
        ctx.globalCompositeOperation = "xor"
        ctx.strokeStyle = "#f90"
        ctx.beginPath()
        ctx.moveTo(xc, 0)
        ctx.lineTo(xc, dstH)
        ctx.moveTo(0, yc)
        ctx.lineTo(dstW, yc)
        ctx.stroke()
        ctx.strokeStyle = "#f90"
        ctx.fillStyle = "#39d3"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.ellipse(xc, yc, 8, 8, 0, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
    }
}
