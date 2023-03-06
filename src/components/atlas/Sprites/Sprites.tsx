import React from "react"
import State from "../../../state"
import Theme from "../../../ui/theme"
import { useServices } from "../../../utils/hooks/services"
import Style from "./Sprites.module.css"

const $ = Theme.classNames

export interface SpritesProps {
    className?: string
}

interface SpriteBounds {
    x: number
    y: number
    width: number
    height: number
}

interface SpriteItem extends SpriteBounds {
    name: string
}

export default function Sprites({ className }: SpritesProps) {
    const [sprites, setSprites] = React.useState<SpriteItem[]>([])
    const [selection, setSelection] = React.useState("")
    const refCanvas = React.useRef<HTMLCanvasElement | null>(null)
    const { bitmap } = useServices()
    const [image, setImage] = React.useState<HTMLImageElement | null>(null)
    const imagePath = State.tools.atlas.imagePath.useValue()
    React.useEffect(() => {
        const action = async () => {
            const img = await bitmap.loadImage(imagePath)
            setImage(img)
        }
        void action()
    }, [imagePath, bitmap])
    React.useEffect(() => {
        const canvas = refCanvas.current
        if (!canvas || !image) return

        function handleCanvasClick(evt: MouseEvent) {
            const canvas = evt.target as HTMLCanvasElement
            const rect = canvas.getBoundingClientRect()
            const x = evt.pageX - rect.x
            const y = evt.pageY - rect.y
            const bounds = computeBounds(canvas, x, y)
            const key = getKey(bounds)
            const sprite = sprites.find(s => getKey(s) === key)
            if (!sprite) {
                setSprites([
                    ...sprites,
                    {
                        ...bounds,
                        name: `sprite${sprites.length + 1}`,
                    },
                ])
            }
            setSelection(key)
        }
        const { width, height } = image
        canvas.width = width
        canvas.height = height
        paint(canvas, image, sprites, selection)
        canvas.addEventListener("dblclick", handleCanvasClick)
        return () => canvas.removeEventListener("dblclick", handleCanvasClick)
    }, [image, sprites, refCanvas.current])
    paint(refCanvas.current, image, sprites, selection)
    return (
        <div className={$.join(className, Style.Sprites)}>
            <main>
                <canvas ref={refCanvas}></canvas>
            </main>
            <aside>
                {sprites.map(sprite => {
                    const key = getKey(sprite)
                    return (
                        <button
                            className={Style.SpriteButton}
                            key={key}
                            title={key}
                            onClick={() => setSelection(key)}
                        >
                            {sprite.name}
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
    sprites: SpriteItem[],
    selection: string
) {
    if (!canvas) return

    console.log("🚀 [Sprites] canvas = ", canvas) // @FIXME: Remove this line written on 2023-03-06 at 18:28
    const { width, height } = canvas
    const ctx = getContext(canvas)
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(image, 0, 0)
    const sprite = sprites.find(s => getKey(s) === selection)
    if (sprite) {
        console.log("🚀 [Sprites] selection, sprite = ", selection, sprite) // @FIXME: Remove this line written on 2023-03-06 at 18:28
        ctx.fillStyle = "#0005"
        ctx.beginPath()
        ctx.rect(
            sprite.x + 1,
            sprite.y + 1,
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
): SpriteBounds {
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
        x: x1,
        y: y1,
        width: x2 - x1 + 1,
        height: y2 - y1 + 1,
    }
}

function getKey(sprite: SpriteBounds) {
    const { x, y, width, height } = sprite
    return `${x},${y} ${width}x${height}`
}
