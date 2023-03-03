export function getExtension(path: string): string {
    const pos = path.lastIndexOf(".")
    return path.substring(pos + 1)
}
