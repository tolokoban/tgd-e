import React from "react"
import Button from "../../ui/view/Button"
import { useServices } from "../../utils/hooks/services"
import { getExtension } from "../../utils/path"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppProps {
    services: ApiInterface
}

export default function App() {
    const { fs, browse } = useServices()
    const [url, setUrl] = React.useState("")
    const [path, setPath] = React.useState(".")
    const [content, setContent] = React.useState<string[]>([])
    React.useEffect(() => {
        fs.getDirContent(path).then(setContent).catch(console.error)
    }, [])
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

        const buff = await fs.readBinary(file)
        const type = `image/${getExtension(file)}`
        console.log("🚀 [App] type = ", type) // @FIXME: Remove this line written on 2023-03-03 at 16:30
        console.log("🚀 [App] buff = ", buff) // @FIXME: Remove this line written on 2023-03-03 at 16:30
        const blob = new Blob([buff], { type })
        setUrl(URL.createObjectURL(blob))
    }
    return (
        <div>
            <h1>SBO test</h1>
            <ul>
                {content.map(f => (
                    <li key={f}>{f}</li>
                ))}
            </ul>
            <Button onClick={handleClick}>Select another directory</Button>
            <img src={url} />
        </div>
    )
}
