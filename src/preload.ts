// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("API", {
    fs: {
        getDirContent(path: string): Promise<string[]> {
            return ipcRenderer.invoke("fs/get-dir-content", path)
        },
    },
})
