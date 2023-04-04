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
    SwipeCell,
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
    SwipeCell,
]

export default {
    install(app: App) {
        vantUIComponents.forEach((component) => {
            app.use(component)
        })
    },
}
