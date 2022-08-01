// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import App from './App.vue'
import VueKonva from 'vue-konva';
import panZoom from 'vue-panzoom'
import { createApp } from '@vue/runtime-dom';
import { store } from './store/index'
import { AssetManager } from './modules/Managers/AssetManager'
import { CONFIG } from './modules/Managers/ConfigManager'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Draggable convenience imports
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
import vClickOutside from "click-outside-vue3"
import { dragscrollNext } from "vue-dragscroll";
import { TroisJSVuePlugin } from 'troisjs';

// independent of App.vue mounting
// this has to be initialized first prior to being mounted on Vue
var assetManager        = new AssetManager()

assetManager.preload(CONFIG.baseAssetUrl).then(() => {

    store.commit('assets/registerAssets', assetManager.assets)
    const app = createApp(App);

    app.component("font-awesome-icon", FontAwesomeIcon)
    app.use(store)
    app.use(VueKonva)
    app.use(Vue3DraggableResizable)
    app.use(panZoom)
    app.use(vClickOutside)
    app.use(TroisJSVuePlugin)

    app.directive('dragscroll', dragscrollNext);
    app.mount("#app")
})

// we can check if the whole app is ready by checking for
// store.state.utils.all.customizerReady
// probably best to have this as a watch component in App.vue
// in the event that screenshot is needed and such
