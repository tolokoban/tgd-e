import Electron from "electron"

export interface BrowseOpenFileOptions {
    path: string
    title: string
    filters: BrowserFilter[]
    multiSelections: boolean
}

type BrowserProperty =
    | "openFile"
    | "openDirectory"
    | "multiSelections"
    | "showHiddenFiles"
    | "createDirectory"
    | "promptToCreate"
    | "noResolveAliases"
    | "treatPackageAsDirectory"
    | "dontAddToRecent"

interface BrowserFilter {
    name: string
    extensions: string[]
}

export default {
    async openFile({
        path = ".",
        title = "Please select a file",
        filters = [],
        multiSelections = false,
    }: Partial<BrowseOpenFileOptions>): Promise<string[]> {
        const properties: BrowserProperty[] = ["openFile"]
        if (multiSelections) properties.push("multiSelections")
        const { canceled, filePaths } = await Electron.dialog.showOpenDialog({
            defaultPath: path,
            title,
            properties,
            filters,
        })
        if (canceled) return []

        return filePaths
    },
}
