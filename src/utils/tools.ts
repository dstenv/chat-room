type FolderName = 'imgs' | 'icons'

export default {
    getUrl(imgName: string, folderName: FolderName = 'icons') {
        return new URL(`../assets/${folderName}/${imgName}`, import.meta.url)
            .href
    },
}
