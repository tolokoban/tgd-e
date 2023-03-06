import React from "react"
import State from "../../../state"
import Theme from "../../../ui/theme"
import { useServices } from "../../../utils/hooks/services"
import Style from "./Sprites.module.css"

const $ = Theme.classNames

export interface SpritesProps {
    className?: string
}

export default function Sprites({ className }: SpritesProps) {
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

        const { width, height } = image
        canvas.width = width
        canvas.height = height
        const ctx = getContext(canvas)
        ctx.clearRect(0, 0, width, height)
        ctx.drawImage(image, 0, 0)
        canvas.addEventListener("dblclick", handleCanvasClick)
    }, [image, refCanvas.current])
    return (
        <div className={$.join(className, Style.Sprites)}>
            <canvas ref={refCanvas}></canvas>
        </div>
    )
}

function handleCanvasClick(evt: MouseEvent) {
    const canvas = evt.target as HTMLCanvasElement
    const rect = canvas.getBoundingClientRect()
    const x = evt.pageX - rect.x
    const y = evt.pageY - rect.y
    console.log("🚀 [Sprites] evt = ", evt) // @FIXME: Remove this line written on 2023-03-06 at 17:06
    console.log("🚀 [Sprites] x, y, rect.x, rect.y = ", x, y, rect.x, rect.y) // @FIXME: Remove this line written on 2023-03-06 at 17:06
    const bounds = computeBounds(canvas, x, y)
    console.log("🚀 [Sprites] bounds = ", bounds) // @FIXME: Remove this line written on 2023-03-06 at 17:21
    const ctx = getContext(canvas)
    ctx.fillStyle = "#f903"
    ctx.beginPath()
    ctx.rect(bounds.x, bounds.y, bounds.width, bounds.height)
    ctx.fill()
}

function getContext(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")
    if (!ctx) throw Error("Unable to create a canvas 2d context!")

    return ctx
}

function computeBounds(canvas: HTMLCanvasElement, x: number, y: number) {
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
