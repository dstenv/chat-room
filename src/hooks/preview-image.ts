import { showImagePreview } from 'vant'

export interface ImgList {
    url: string
    id: string
    time: number
}

export const usePreviewImage = () => {
    const imgList = ref<ImgList[]>([])

    const addImg = (imgData: ImgList) => {
        const find = imgList.value.find((img) => img.id === imgData.id)

        if (find) {
            find.url = imgData.url || find.url
        } else {
            imgList.value.push({ ...imgData })
            imgList.value = imgList.value.sort(
                (prev, next) => prev.time - next.time
            )
        }
    }

    const deleteImg = (id: string | string[]) => {
        if (typeof id === 'string') {
            imgList.value.filter((img) => img.id !== id)
        } else {
            for (let i = 0; i < id.length; i++) {
                imgList.value.filter((img) => img.id !== id[i])
            }
        }
    }

    const preview = (id: string) => {
        const index = imgList.value.findIndex((img) => img.id === id)

        showImagePreview({
            images: imgList.value.map((img) => img.url),
            loop: false,
            startPosition: index === -1 ? 0 : index,
        })
    }

    return {
        imgList,
        addImg,
        deleteImg,
        preview,
    }
}
