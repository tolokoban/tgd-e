import React from "react"
import Service from "../../service"
import State from "../../state"
import Button from "../../ui/view/Button"
import { useServices } from "../../utils/hooks/services"
import Pages from "../Pages"
import AtlasSprites from "../atlas/Sprites"
import { atlasMakeFromImagePath } from "../../format/atlas/atlas"
import { replaceExtension } from "../../utils/path"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppProps {
    services: Service
}

export default function App() {
    const { browse, fs } = useServices()
    const handleClick = async () => {
        const files: string[] = await browse.openFile({
            filters: [
                {
                    name: "Transparent Image",
                    extensions: ["webp", "png", "atlas"],
                },
            ],
        })
        console.log("🚀 [App] files = ", files) // @FIXME: Remove this line written on 2023-03-03 at 14:35
        const [file] = files
        if (!file) return

        if (file.endsWith("atlas")) {
            State.tools.atlas.path.value = file
        } else {
            const path = replaceExtension(file, "atlas")
            // @TODO: If atlas already exists, do not recreate it.
            const atlas = atlasMakeFromImagePath(file)
            await fs.saveJSON(path, atlas)
            State.tools.atlas.path.value = path
        }
        State.page.value = "atlas-sprites"
    }
    return (
        <Pages>
            <div>
                <Button onClick={handleClick}>Select another directory</Button>
            </div>
            <AtlasSprites key="atlas-sprites" />
        </Pages>
    )
}
