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
    Switch,
    List,
    Loading,
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
    Switch,
    List,
    Loading,
]

export default {
    install(app: App) {
        vantUIComponents.forEach((component) => {
            app.use(component)
        })
    },
}
