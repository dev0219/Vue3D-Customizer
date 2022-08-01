import { createStore } from 'vuex';

import Yarns from './modules/Yarns/Yarns'
import Canvas from './modules/Canvas/Canvas'
import UI from './modules/UI/UI';
import Assets from './Assets'
import Utils from './Utils';

const store = createStore({})

store.registerModule( 'yarns',  new Yarns().getModule())
store.registerModule( 'canvas', new Canvas().getModule())
store.registerModule( 'ui',     new UI().getModule())
store.registerModule( 'assets', new Assets().getModule())
store.registerModule( 'utils',  new Utils().getModule())

export { store }