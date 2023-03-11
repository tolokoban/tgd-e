import React from "react"
import {
    atlasAddSprite,
    atlasFindSprite,
    spriteGetKey,
    TgdSpriteBounds,
    useTgdAtlas,
} from "../../../format/atlas/atlas"
import Theme from "../../../ui/theme"
import Gesture, { TapEvent } from "../../../utils/gesture"
import { useServices } from "../../../utils/hooks/services"
import Scroller from "../../Scroller"
import Style from "./Sprites.module.css"

const $ = Theme.classNames

export interface SpritesProps {
    className?: string
}

export default function Sprites({ className }: SpritesProps) {
    const [atlas, setAtlas] = useTgdAtlas()
    const [selection, setSelection] = React.useState<TgdSpriteBounds | null>(
        null
    )
    const refCanvas = React.useRef<HTMLCanvasElement | null>(null)
    const { bitmap } = useServices()
    const [image, setImage] = React.useState<HTMLImageElement | null>(null)
    React.useEffect(() => {
        if (!atlas) return

        const action = async () => {
            const img = await bitmap.loadImage(atlas.image)
            setImage(img)
        }
        void action()
    }, [atlas, bitmap])
    React.useEffect(() => {
        const canvas = refCanvas.current
        if (!canvas || !image) return

        function handleCanvasClick({ x, y }: TapEvent) {
            const bounds = computeBounds(canvas, x, y)
            const key = spriteGetKey(bounds)
            const sprite = atlasFindSprite(atlas, bounds)
            if (!sprite)
                setAtlas(
                    atlasAddSprite(atlas, {
                        id: key,
                        ...bounds,
                        centerX: 0.5,
                        centerY: 1,
                    })
                )
            setSelection({ ...sprite })
        }
        const { width, height } = image
        canvas.width = width
        canvas.height = height
        paint(canvas, image, atlasFindSprite(atlas, selection))
        const gesture = new Gesture(canvas)
        gesture.eventDoubleTap.addListener(handleCanvasClick)
        return () => {
            gesture.eventDoubleTap.removeListener(handleCanvasClick)
            gesture.detach()
        }
    }, [image, atlas, refCanvas.current])
    paint(refCanvas.current, image, selection)
    const sprites = atlas?.sprites ?? []
    return (
        <div className={$.join(className, Style.Sprites)}>
            <Scroller className={Style.main}>
                <canvas ref={refCanvas}></canvas>
            </Scroller>
            <aside>
                {sprites.map(sprite => {
                    const { id } = sprite
                    return (
                        <button
                            className={Style.SpriteButton}
                            key={id}
                            title={id}
                            onClick={() => setSelection({ ...sprite })}
                        >
                            {sprite.id}
                        </button>
                    )
                })}
            </aside>
        </div>
    )
}

function paint(
    canvas: HTMLCanvasElement | null,
    image: HTMLImageElement | null,
    sprite?: TgdSpriteBounds | null
) {
    if (!canvas) return

    const { width, height } = canvas
    const ctx = getContext(canvas)
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(image, 0, 0)
    if (sprite) {
        ctx.fillStyle = "#0005"
        ctx.beginPath()
        ctx.rect(
            sprite.left + 1,
            sprite.top + 1,
            sprite.width - 2,
            sprite.height - 2
        )
        ctx.fill()
    }
}

function getContext(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")
    if (!ctx) throw Error("Unable to create a canvas 2d context!")

    return ctx
}

function computeBounds(
    canvas: HTMLCanvasElement,
    x: number,
    y: number
): TgdSpriteBounds {
    const ctx = getContext(canvas)
    const w = canvas.width
    const h = canvas.height
    const idx = (x: number, y: number) => 3 + (x + y * w) * 4
    let x1 = Math.max(0, x - 1)
    let y1 = Math.max(0, y - 1)
    let x2 = Math.min(w - 1, x + 1)
    let y2 = Math.min(h - 1, y + 1)
    const data = ctx.getImageData(0, 0, w, h).data
    let mustGrow = true
    while (mustGrow) {
        mustGrow = false
        if (x1 > 0) {
            // Check left.
            for (let y = y1; y <= y2; y++) {
                if (data[idx(x1, y)] > 0) {
                    x1--
                    mustGrow = true
                    break
                }
            }
        }
        if (y1 > 0) {
            // Check top.
            for (let x = x1; x <= x2; x++) {
                if (data[idx(x, y1)] > 0) {
                    y1--
                    mustGrow = true
                    break
                }
            }
        }
        if (x2 < w - 1) {
            // Check right.
            for (let y = y1; y <= y2; y++) {
                if (data[idx(x2, y)] > 0) {
                    x2++
                    mustGrow = true
                    break
                }
            }
        }
        if (y2 < h - 1) {
            // Check bottom.
            for (let x = x1; x <= x2; x++) {
                if (data[idx(x, y2)] > 0) {
                    y2++
                    mustGrow = true
                    break
                }
            }
        }
    }
    return {
        left: x1,
        top: y1,
        width: x2 - x1 + 1,
        height: y2 - y1 + 1,
    }
}
