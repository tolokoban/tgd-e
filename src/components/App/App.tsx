import React from "react"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppProps {
    services: ApiInterface
}

export default function App(props: AppProps) {
    const [content, setContent] = React.useState<string[]>([])
    React.useEffect(() => {
        console.log("🚀 [App] props = ", props) // @FIXME: Remove this line written on 2023-02-22 at 17:18
        props.services.fs
            .getDirContent(".")
            .then(setContent)
            .catch(console.error)
    }, [])
    return (
        <div>
            <h1>SBO test</h1>
            <ul>
                {content.map(f => (
                    <li key={f}>{f}</li>
                ))}
            </ul>
        </div>
    )
}
