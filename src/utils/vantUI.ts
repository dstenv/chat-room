import { Button, Tabbar, TabbarItem } from 'vant'
import type { App } from 'vue'

const vantUIComponents = [Button, Tabbar, TabbarItem]

export default {
    install(app: App) {
        vantUIComponents.forEach((component) => {
            app.use(component)
        })
    },
}
