export interface MyStorageType {
    setNullFn?: () => void
    noTimeFn?: () => void
    getNullFn?: () => void
    expireTimeFn?: () => void
}

export class MyStorage {
    static storageInst: null | MyStorage
    /**
     * @description: 存储空值自定义操作函数
     * @return {*}
     */
    private setNullFn: (() => void) | null | undefined
    /**
     * @description: 未设置过期时间自定义操作函数
     * @return {*}
     */
    private noTimeFn: (() => void) | null | undefined
    /**
     * @description: 读取时无该字段自定义操作函数
     * @return {*}
     */
    private getNullFn: (() => void) | null | undefined
    /**
     * @description: 存储过期自定义操作函数
     * @return {*}
     */
    private expireTimeFn: (() => void) | null | undefined

    constructor({
        setNullFn,
        noTimeFn,
        getNullFn,
        expireTimeFn,
    }: MyStorageType) {
        this.setNullFn = setNullFn
        this.noTimeFn = noTimeFn
        this.getNullFn = getNullFn
        this.expireTimeFn = expireTimeFn
        MyStorage.storageInst = null
    }

    set<T extends { time: string }>(key: string, value: T): boolean {
        if (Object.keys(value).length <= 1) {
            // TODO 存储数据为空
            this.setNullFn && this.setNullFn()
            return false
        }

        if (!value.time) {
            // TODO 请设置过期时间
            this.noTimeFn && this.noTimeFn()
            return false
        }

        const setTime = +new Date(value.time)

        localStorage.setItem(key, JSON.stringify({ ...value, time: setTime }))

        return true
    }
    get(key: string): any | null {
        const value = localStorage.getItem(key)

        if (value === null) {
            // TODO 无该字段的存储数据
            this.getNullFn && this.getNullFn()
            return null
        }

        const data = JSON.parse(value)

        if (data.time < +new Date()) {
            // TODO 存储数据过期
            this.expireTimeFn && this.expireTimeFn()
            this.remove(key)
            return null
        }

        return data
    }
    remove(key: string) {
        localStorage.removeItem(key)
    }

    static getInstance(param: MyStorageType) {
        if (!this.storageInst) {
            this.storageInst = new MyStorage(param)
        }
        return this.storageInst
    }
}

export const useMyStorage = (param: MyStorageType) =>
    MyStorage.getInstance(param)
