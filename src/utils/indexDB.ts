import type { MessageData } from '@/types/message'
import { Defer } from './defer'

class DB {
    private dbName = ''
    dbVersion = 0
    private db: IDBOpenDBRequest
    read: null | Defer<void>
    storage: any
    tables: string[]
    static DBInstance: null | DB

    constructor(name: string, version: number, tables: string[]) {
        this.dbName = name
        this.dbVersion = version
        this.tables = tables
        this.db = window.indexedDB.open(this.dbName, this.dbVersion)
        this.read = new Defer()
        this.db.onupgradeneeded = async (e: any) => {
            this.storage = e.target.result
            if (this.read) {
                await this.read.promise
                this.createTable()
                this.read = null
            }
        }
        this.db.onsuccess = async (e: any) => {
            this.storage = e.target.result
            if (this.read) {
                await this.read.promise
                this.createTable()
                this.read = null
            }
        }
    }

    private createTable() {
        if (!this.storage) return
        this.tables.forEach((table) => {
            if (!this.storage.objectStoreNames.contains(table)) {
                console.log(this.storage, 'this.storage')
                this.storage.createObjectStore(table, { autoIncrement: true })
            }
        })
        this.read!.resolve()
    }

    /** 更新数据库 */
    private update() {
        console.log('update')
        this.db = window.indexedDB.open(this.dbName, this.dbVersion)
        this.db.onupgradeneeded = (e: any) => {
            this.storage = e.target.result
            this.createTable()
        }
    }

    /** 打开数据库 */
    open() {
        this.db = window.indexedDB.open(this.dbName, this.dbVersion)
        this.db.onsuccess = () => {
            this.storage = this.db.result
            this.createTable()
        }
    }

    /** 新建一个表 */
    addTable(tableName: string, version: number) {
        this.tables.push(tableName)
        this.dbVersion = version
        this.update()
    }

    /** 向其中一个表新增一条数据 */
    addSource(tableName: string, data: any) {
        return new Promise((res, rej) => {
            const transaction = this.storage.transaction(
                [tableName],
                'readwrite'
            )
            /**
             * TODO 这里的对象不能是经过proxy代理过的对象 否则会报错：对象无法被克隆
             */
            const request = transaction?.objectStore(tableName).add(data)

            request.onsuccess = () => {
                console.log(data, '新增数据成功')
                res(data)
            }

            request.onerror = () => {
                console.log(data, '新增数据失败')
                rej()
            }
        })
    }

    /** 查找指定表的所有信息 */
    findSourceByTable(tableName: string) {
        return new Promise((res) => {
            const transaction = this.storage.transaction([tableName])

            const list: MessageData[] = []
            transaction.objectStore(tableName).openCursor().onsuccess = (
                e: any
            ) => {
                const cursor = e.target.result
                if (cursor) {
                    list.push({ ...cursor.value })
                    cursor.continue()
                } else {
                    res(list)
                }
            }
        })
    }

    static getIntance() {
        if (!DB.DBInstance) {
            DB.DBInstance = new this('chat_DB', 1, tableList)
        }
        return DB.DBInstance
    }
}

export const tableList = ['message']

const createDB = () => DB.getIntance()

export const db = createDB()
