import BrowseService, { BrowseOpenFileOptions } from "./browse"
import FileSystemService from "./fs"
import { ipcMain, IpcMainInvokeEvent } from "electron"
import { assertType, TypeDef } from "../../utils/type-guards"

export default class Server {
    constructor() {
        this.register(
            "fs/load-json",
            (path: string) => FileSystemService.loadJSON(path),
            ["string"]
        )
        this.register(
            "fs/save-json",
            (path: string, data: unknown) =>
                FileSystemService.saveJSON(path, data),
            ["string", "unknown"]
        )
        this.register(
            "fs/read-binary",
            (path: string) => FileSystemService.readBinary(path),
            ["string"]
        )
        this.register(
            "fs/get-dir-content",
            (path: string) => FileSystemService.getDirContent(path),
            ["string"]
        )
        this.register(
            "browse/open-file",
            (options: Partial<BrowseOpenFileOptions>) =>
                BrowseService.openFile(options),
            [
                [
                    "partial",
                    {
                        path: "string",
                        title: "string",
                        multiSelections: "boolean",
                    },
                ],
            ]
        )
    }

    register<INPUT extends unknown[]>(
        method: string,
        slot: (...params: INPUT) => Promise<unknown>,
        inputTypes: TypeDef[]
    ) {
        ipcMain.handle(
            method,
            (_evt: IpcMainInvokeEvent, ...params: unknown[]) => {
                assertType<INPUT>(params, ["sequence", inputTypes])
                return slot(...params)
            }
        )
        console.log("Register server method:", method)
    }
}
