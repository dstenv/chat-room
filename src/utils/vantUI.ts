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
    Checkbox,
    CheckboxGroup,
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
    Checkbox,
    CheckboxGroup,
]

export default {
    install(app: App) {
        vantUIComponents.forEach((component) => {
            app.use(component)
        })
    },
}
