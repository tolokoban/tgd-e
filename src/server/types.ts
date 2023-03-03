export interface FileSystemServiceInterface {
    getDirContent(path: string): Promise<string[]>
}
