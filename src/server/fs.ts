import { FileSystemServiceInterface } from "./types"
import * as FS from "fs"

class FileSystemService implements FileSystemServiceInterface {
    getDirContent(path: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            FS.readdir(
                path,
                {
                    withFileTypes: true,
                },
                (err, files) => {
                    if (err) reject(err)
                    else resolve(files.map(file => file.name))
                }
            )
        })
    }
}

export default new FileSystemService()
