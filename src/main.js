import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/theme/default/index.less'
import i18n from '@/assets/lang'
import { DropdownMenu, DropdownItem, Overlay, Field, Icon, Button, Toast, Cell, CellGroup, Radio, RadioGroup } from 'vant'

createApp(App).use(store).use(router).use(i18n)
  .use(DropdownMenu).use(DropdownItem).use(Overlay).use(Field).use(Icon).use(Button).use(Toast).use(Cell).use(CellGroup).use(Radio).use(RadioGroup)
  .mount('#app')
