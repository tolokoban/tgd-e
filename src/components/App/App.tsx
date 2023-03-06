import React from "react"
import Service from "../../service"
import State from "../../state"
import Button from "../../ui/view/Button"
import { useServices } from "../../utils/hooks/services"
import Pages from "../Pages"
import AtlasSprites from "../atlas/Sprites"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppProps {
    services: Service
}

export default function App() {
    const { browse } = useServices()
    const handleClick = async () => {
        const files = await browse.openFile({
            filters: [
                {
                    name: "Transparent Image",
                    extensions: ["webp", "png"],
                },
            ],
        })
        console.log("🚀 [App] files = ", files) // @FIXME: Remove this line written on 2023-03-03 at 14:35
        const [file] = files
        if (!file) return

        State.tools.atlas.imagePath.value = file
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
