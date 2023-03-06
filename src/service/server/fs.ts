import { FileSystemServiceInterface } from "./types"
import * as FS from "fs/promises"

class FileSystemService implements FileSystemServiceInterface {
    async readBinary(path: string): Promise<ArrayBuffer> {
        const data = await FS.readFile(path)
        return data
    }

    async getDirContent(path: string): Promise<string[]> {
        const files = await FS.readdir(path, {
            withFileTypes: true,
        })

        return files.map(file => file.name)
    }
}

export default new FileSystemService()
