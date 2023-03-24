type FolderName = 'imgs' | 'icons'

export default {
    getUrl(imgName: string, folderName: FolderName = 'icons') {
        return new URL(`../assets/${folderName}/${imgName}`, import.meta.url)
            .href
    },

    /**
     * @description 压缩图片
     * @param {*} url 可访问的图片连接
     * @return {*}
     */
    compressImage(url: string): Promise<Blob> {
        return new Promise((res, rej) => {
            const img = document.createElement('img')
            img.src = url
            img.onload = function () {
                const canvas = document.createElement('canvas')
                const context = canvas.getContext('2d')

                if (context) {
                    const { width: originW, height: originH } = img
                    const imgScale = originW / originH

                    canvas.width = originW
                    canvas.height = originH

                    // const myQuality = Math.min((2000 * 2000) / originW / originH, 1)

                    if (originW * originH >= 512 * 1024) {
                        const compressH = Math.sqrt((512 * 1024) / imgScale)
                        const compressW = (512 * 1024) / compressH

                        canvas.width = compressW
                        canvas.height = compressH
                    }

                    context.fillStyle = 'rgba(255,255,255,1)'
                    context.fillRect(0, 0, canvas.width, canvas.height)
                    context.drawImage(img, 0, 0, canvas.width, canvas.height)
                    canvas.toBlob(
                        (data) => {
                            if (data) {
                                res(data)
                                return
                            }
                            rej()
                        },
                        'image/jpeg',
                        1
                    )
                }
            }
        })
    },
}
