import {
    Button,
    Tabbar,
    TabbarItem,
    Form,
    Field,
    CellGroup,
    Popover,
    PullRefresh,
    Image,
    Popup,
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
    PullRefresh,
    Image,
    Popup,
]

export default {
    install(app: App) {
        vantUIComponents.forEach((component) => {
            app.use(component)
        })
    },
}
