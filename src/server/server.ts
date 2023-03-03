import FileSystemService from "./fs"
import { ipcMain, IpcMainInvokeEvent } from "electron"
import { assertType, TypeDef } from "../utils/type-guards"

export default class Server {
    constructor() {
        this.register(
            "fs/get-dir-content",
            (path: string) => FileSystemService.getDirContent(path),
            ["string"]
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
