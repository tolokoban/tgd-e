import React from "react"
import {
    atlasAddSprite,
    atlasFindSprite,
    spriteGetKey,
    TgdAtlas,
    TgdAtlasSprite,
    TgdSpriteBounds,
    useTgdAtlas,
} from "../../../format/atlas/atlas"
import Theme from "../../../ui/theme"
import Tab from "../../../ui/view/Tab"
import Tabs from "../../../ui/view/Tabs"
import Gesture, { TapEvent } from "../../../utils/gesture"
import { useServices } from "../../../utils/hooks/services"
import Scroller from "../../Scroller"
import SpriteItem from "./SpriteItem"
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
    const handleSpriteUpdate = (sprite: TgdAtlasSprite) => {
        const newAtlas = atlasAddSprite(atlas, sprite)
        // @TODO: Check that we don't have two sprites with the same name.
        setAtlas(newAtlas)
    }
    React.useEffect(() => {
        if (!atlas) return

        const action = async () => {
            console.log("🚀 [Sprites] atlas.image = ", atlas.image) // @FIXME: Remove this line written on 2023-03-11 at 16:36
            setImage(await bitmap.loadImage(atlas.image))
        }
        void action()
    }, [atlas, bitmap])
    useAtlasCanvas(refCanvas, image, atlas, setAtlas, setSelection, selection)
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
                        <SpriteItem
                            key={id}
                            sprite={sprite}
                            image={image}
                            selected={
                                spriteGetKey(sprite) === spriteGetKey(selection)
                            }
                            onSelection={setSelection}
                            onUpdate={handleSpriteUpdate}
                        />
                    )
                })}
                <Tabs vertical>
                    <Tab label="Hello">
                        <div>Hello world</div>
                    </Tab>
                    <Tab label="Vive">
                        <div>Vive le vent</div>
                    </Tab>
                    <Tab label="Cerise sur le gâteau">
                        <div>J'aime bien les cerises.</div>
                    </Tab>
                    <Tab label="Gâteau aux pommes">
                        <div>Dont j'ai le secret.</div>
                    </Tab>
                </Tabs>
            </aside>
        </div>
    )
}

function useAtlasCanvas(
    refCanvas: React.MutableRefObject<HTMLCanvasElement>,
    image: HTMLImageElement,
    atlas: TgdAtlas,
    setAtlas: (
        atlas: import("/home/tolokoban/Code/github/tgd-e/src/format/atlas/atlas").TgdAtlas
    ) => void,
    setSelection: React.Dispatch<React.SetStateAction<TgdSpriteBounds>>,
    selection: TgdSpriteBounds
) {
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
            setSelection({ ...bounds })
        }
        const { width, height } = image
        canvas.width = width
        canvas.height = height
        paint(canvas, image, selection)
        const gesture = new Gesture(canvas)
        gesture.eventDoubleTap.addListener(handleCanvasClick)
        return () => {
            gesture.eventDoubleTap.removeListener(handleCanvasClick)
            gesture.detach()
        }
    }, [image, atlas, refCanvas.current])
}

function paint(
    canvas: HTMLCanvasElement | null,
    image: HTMLImageElement | null,
    selection?: TgdSpriteBounds | null
) {
    if (!canvas) return

    const { width, height } = canvas
    const ctx = getContext(canvas)
    ctx.clearRect(0, 0, width, height)
    console.log("🚀 [Sprites] image, selection = ", image, selection) // @FIXME: Remove this line written on 2023-03-11 at 17:02
    if (image) ctx.drawImage(image, 0, 0)
    if (selection) {
        ctx.strokeStyle = "#0007"
        ctx.fillStyle = "#fff7"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.rect(
            selection.left + 1,
            selection.top + 1,
            selection.width - 2,
            selection.height - 2
        )
        ctx.fill()
        ctx.stroke()
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
