import { StructurePreview } from "./StructurePreview"

export default class {

    constructor() {

        this.state = {

            all         : {

                // loader stuff
                loadPercentage      : 0,

                visualizerReady     : 0,
                // count assets on loading
                assetsReady         : 0,
                assetsTotal         : 1,
                // count konva assets that's ready
                konvaReady          : 0,
                konvaTotal          : 1,
                uiReady             : 0,

                // reprocess everything
                reprocess           : 0,
                canvasImage         : new Image(),
                // for colored preview of structures
                structurePreview    : new StructurePreview(),

                // will be set to true once all queued in loaders are done
                customizerReady     : false,

            },

        }

        this.getters = {

            getInterface: (state) => (name) => {

                return state.all[name]
                
            },

            getAssets: (state, getters, rootState, rootGetters) => {
                return rootGetters['assets/getAll']()
            },

            getStructurePreviews: (state) => () => {
                return state.all.structurePreview.previews
            },

            getCanvasImage: (state) => () => {
                return state.all.canvasImage
            }

        }

        this.actions = {

            updatePreview(context, payload) {
                
                var allAssets = context.getters.getAssets
                var {allYarnColors, allStructures} = payload
                // probably should pass this on to mutation first for best practice but so far it's fine
                context.state.all['structurePreview'].updatePreview(
                    allYarnColors,
                    allStructures,
                    allAssets)
            },

            updateCanvas(context, value) {
                let id = 'canvasImage'
                context.commit('update', {id, value})
            },

            updateLoadPercentage(context) {

                var id = 'loadPercentage'
                let a = context.state.all
                
                var konva       = a.konvaReady / a.konvaTotal 
                var visualizer  = a.visualizerReady
                var ui          = a.uiReady
                var assets      = a.assetsReady / a.assetsTotal

                // equal percentage right now... can change
                var value = (assets + ui + konva + visualizer)/4 * 100
                context.commit('update', {id, value})

                if (value == 100) {
                    var id = 'customizerReady'
                    var value = true
                    context.commit('update', {id, value})
                }

            },
            
            reprocess(context) {
                var now = context.getters.getInterface('reprocess')
                var id = 'reprocess'
                var value = now + 1
                context.commit('update', {id, value})
            }
        }

        this.mutations = {    

            update: (state, payload) => {
                let {id, value} = payload
                state.all[id] = value
            }

        }

    }

    // how to get modules
    getModule() {

        return {
            
            namespaced  : true,
            state       : this.state,
            getters     : this.getters,
            actions     : this.actions,
            mutations   : this.mutations,
            modules     : this.modules,
        
        };

    }

}