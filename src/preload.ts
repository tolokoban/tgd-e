// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron"
import { BrowseOpenFileOptions } from "./service/server/browse"

const API: ApiInterface = {
    browse: {
        openFile(options: Partial<BrowseOpenFileOptions>): Promise<string[]> {
            return ipcRenderer.invoke("browse/open-file", options)
        },
    },

    fs: {
        async loadJSON<T>(
            path: string,
            guard: (data: unknown) => asserts data is T
        ): Promise<T> {
            const data = await ipcRenderer.invoke("fs/load-json", path)
            guard(data)
            return data
        },
        saveJSON(path: string, data: unknown): Promise<void> {
            return ipcRenderer.invoke("fs/save-json", path, data)
        },
        readBinary(path: string): Promise<ArrayBuffer> {
            return ipcRenderer.invoke("fs/read-binary", path)
        },
        getDirContent(path: string): Promise<string[]> {
            return ipcRenderer.invoke("fs/get-dir-content", path)
        },
    },
}

contextBridge.exposeInMainWorld("API", API)
