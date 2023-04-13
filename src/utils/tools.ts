import { useChatListStore } from '@/stores/chatList'

export namespace Tools {
    type FolderName = 'imgs' | 'icons'
    type TimeType =
        | 'yyyy-MM-dd'
        | 'hh:mm'
        | 'MM月dd日 hh:mm'
        | 'yyyy年MM月dd日 hh:mm'
        | '星期day hh:mm'

    const ONE_DAY_TIME = 86400000

    const weekObj: { [key: string]: string } = {
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六',
        0: '日',
    }

    export function getUrl(imgName: string, folderName: FolderName = 'icons') {
        return new URL(`../assets/${folderName}/${imgName}`, import.meta.url)
            .href
    }

    /**
     * @description 压缩图片
     * @param {*} url 可访问的图片连接
     * @return {*}
     */
    export function compressImage(url: string): Promise<Blob> {
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
    }

    /** 格式化时间 */
    export function format(time: number, type: TimeType = 'yyyy-MM-dd') {
        if (time.toString().length <= 10) {
            time *= 1000
        }
        const Time = new Date(time)

        const obj: {
            [key: string]: string
        } = {
            yyyy: `${Time.getFullYear()}`,
            MM: `${Time.getMonth() + 1 + 100}`.slice(1, 3),
            dd: `${Time.getDate() + 100}`.slice(1, 3),
            hh: `${Time.getHours() + 100}`.slice(1, 3),
            mm: `${Time.getMinutes() + 100}`.slice(1, 3),
            ss: `${Time.getSeconds() + 100}`.slice(1, 3),
            day: weekObj[`${Time.getDay()}`],
        }

        let str: string = type
        for (const key in obj) {
            str = str.replace(key, obj[key])
        }

        return str
    }

    /** 展示消息的时间 */
    export function showMsgTime(time: number) {
        let str = ''
        const now = +new Date()
        if (now - time < ONE_DAY_TIME) {
            // console.log('当天消息')
            str = format(time, 'hh:mm')
        } else if (now - time < ONE_DAY_TIME * 2) {
            // console.log('昨天')
            str = `昨天 ${format(time, 'hh:mm')}`
        } else if (now - time < ONE_DAY_TIME * 7) {
            // console.log('一周内')
            str = format(time, '星期day hh:mm')
        } else if (now - time < ONE_DAY_TIME * 366) {
            // console.log('一年内')
            str = format(time, 'MM月dd日 hh:mm')
        } else {
            str = format(time, 'yyyy年MM月dd日 hh:mm')
        }

        return str
    }

    /** 格式化字符串 */
    export function queryString(data: { [key: string]: any }) {
        let str = ''

        for (const key in data) {
            str += `${key}=${data[key]}&`
        }

        return str.slice(0, str.length - 1)
    }

    export function getDefaultAvatar(bool: boolean, avatar?: string) {
        return (
            avatar ||
            Tools.getUrl(
                bool
                    ? 'avatar-default-uwoman.png.png'
                    : 'avatar-default-uman.png.png'
            )
        )
    }

    export function deleteRepeat<T>(list: T[], key?: keyof T) {
        const newList: T[] = []

        for (let i = 0; i < list.length; i++) {
            const find = newList.find((item) => {
                if (key) {
                    return item[key] === list[i][key]
                }
                return item === list[i]
            })

            if (!find) {
                newList.push({ ...list[i] })
            }
        }

        return newList.map((item) => ({ ...item }))
    }

    export function checkInBlackList(id: string) {
        return (
            useChatListStore().blackList.findIndex((item) => item.id === id) !==
            -1
        )
    }

    export function doubonce(
        fn: (...args: any) => Promise<any> | any,
        wait = 500
    ) {
        let timer: null | NodeJS.Timeout | number = null

        return function (this: any, ...args: any) {
            if (timer) {
                clearTimeout(timer)
            }

            timer = setTimeout(() => {
                console.log('执行函数')
                fn.apply(this, args)
                clearTimeout(timer as number)
                timer = null
            }, wait)
        }
    }
}
