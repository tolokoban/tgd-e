import React from "react"
import { useServices } from "../../utils/hooks/services"
import { assertType } from "../../utils/type-guards"
import State from "../../state"

export interface TgdSpriteBounds {
    left: number
    top: number
    width: number
    height: number
}

export interface TgdAtlasSprite extends TgdSpriteBounds {
    id: string
    centerX: number
    centerY: number
}

export interface TgdAtlas {
    image: string
    sprites: TgdAtlasSprite[]
}

export function assertTgdAtlas(data: unknown): asserts data is TgdAtlas {
    assertType<TgdAtlas>(data, {
        image: "string",
        sprites: [
            "array",
            {
                id: "string",
                left: "number",
                top: "number",
                width: "number",
                height: "number",
                centerX: "number",
                centerY: "number",
            },
        ],
    })
}

export function atlasMakeFromImagePath(imagePath: string): TgdAtlas {
    return {
        image: imagePath,
        sprites: [],
    }
}

export function spriteGetKey({
    left,
    top,
    width,
    height,
}: TgdSpriteBounds): string {
    return `${left},${top} (${width}×${height})`
}

export function atlasFindSprite(atlas: TgdAtlas, sprite: TgdSpriteBounds) {
    const key = spriteGetKey(sprite)
    return atlas.sprites.find(item => spriteGetKey(item) === key)
}

export function atlasAddSprite(
    atlas: TgdAtlas,
    sprite: TgdAtlasSprite
): TgdAtlas {
    const similarSprite = atlasFindSprite(atlas, sprite)
    if (!similarSprite) {
        return {
            ...atlas,
            sprites: [...atlas.sprites, sprite],
        }
    }

    if (JSON.stringify(similarSprite) === JSON.stringify(sprite)) return atlas

    const newSprites = [...atlas.sprites]
    const index = newSprites.indexOf(similarSprite)
    if (index > -1) {
        newSprites[index] = sprite
    }
    return {
        ...atlas,
        sprites: newSprites,
    }
}

export function useTgdAtlas(): [
    atlas: TgdAtlas | null,
    setAtlas: (atlas: TgdAtlas | null) => void
] {
    const { fs } = useServices()
    const atlasPath = State.tools.atlas.path.useValue()
    const [atlas, setAtlas] = React.useState<TgdAtlas | null>(null)
    React.useEffect(() => {
        const action = async () => {
            setAtlas(null)
            if (!atlasPath) return

            const loadedAtlas = await fs.loadJSON(atlasPath, assertTgdAtlas)
            setAtlas(loadedAtlas)
        }
        void action()
    }, [fs])
    return [
        atlas,
        (newAtlas: TgdAtlas | null) => {
            if (atlas === newAtlas) return

            setAtlas(newAtlas)
            if (!newAtlas || !atlasPath) return

            fs.saveJSON(atlasPath, newAtlas)
        },
    ]
}
