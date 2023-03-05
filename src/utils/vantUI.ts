import {
    Button,
    Tabbar,
    TabbarItem,
    Form,
    Field,
    CellGroup,
    Popover,
} from 'vant'
import type { App } from 'vue'

const vantUIComponents = [
    Button,
    Tabbar,
    TabbarItem,
    Form,
    Field,
    CellGroup,
    Popover,
]

export default {
    install(app: App) {
        vantUIComponents.forEach((component) => {
            app.use(component)
        })
    },
}
