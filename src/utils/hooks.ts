export class Hook<T extends (...args: any) => void> {
    private hooks: { key: string; fn: T }[]

    constructor() {
        this.hooks = []
    }

    register(fn: T): string {
        const key = `${Date.now().toString(36)}${Math.random() * 100 + 10}`
        this.hooks.push({
            key,
            fn,
        })
        return key
    }

    unregister(key: string) {
        this.hooks.filter((hook) => hook.key !== key)
    }

    unregisterAll() {
        this.hooks = []
    }

    trigger() {
        for (let i = 0; i < this.hooks.length; i++) {
            this.hooks[i].fn()
        }
    }
}
