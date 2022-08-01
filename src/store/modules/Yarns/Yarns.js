import { hexToRgbA } from "../../../helpers/helpers";
import { CONFIG } from "../../../modules/Managers/ConfigManager";
import BaseModule from "../../BaseModule";
import Yarn from "./Yarn";

export default class extends BaseModule {

    constructor() {
        
        super()

        this.actions = {
            ...this.actions,

            createState: async (context, payload) => {

                return new Promise((resolve, reject)=> {

                    var { type, params, children, parentId } = payload
                    var state;

                    switch(type) {

                        case 'yarn':
                            state = new Yarn();
                            break
                        
                        default:
                            console.warn('unrecognized state type for Yarns!')
                            return undefined                

                    }

                    context.dispatch('handleStateCreation', { state, type, params, children, parentId })
                    .then(()=> {
                        resolve()
                    })

                })
                
            },

            initState: async (context, payload) => {

                return new Promise((resolve, reject)=> {                
                    var {state, params, parentId} = payload

                    state.injectParameters(params).then((newParams) => {
                        
                        for (const key in newParams) {
                            state.params[key] = newParams[key]
                        }

                        var newState = state;
                        var stateGetter = context.getters.getStateById

                        context.commit('addState', {newState, parentId, stateGetter})
                        
                        
                    }).then(()=> {

                        var allYarns = context.getters.getAll()
                        var allYarnColors = []
                        allYarns.forEach( yarn => {

                            let activeValue  = yarn.params.value
                            let activeObject = yarn.params.options.filter(op => op.value == activeValue)
                            let activeColor  = activeObject[0].color
                
                            allYarnColors.push(hexToRgbA(activeColor))
                            
                        });

                        var allStructures = CONFIG.getStructuresConfig()
                        
                        context.dispatch('utils/updatePreview', {allYarnColors, allStructures}, {root:true})

                        resolve()

                    })
                })

            },

            // custom handler for yarns to accomodate structure preview
            inject: async (context, payload) => {

                return new Promise((resolve, reject)=> {                

                    var { id , params, reprocessCanvas } = payload
                    if (reprocessCanvas == undefined) reprocessCanvas = true
                    var target   = context.getters.getStateById(id)
                    target.injectParameters(params).then((newParams) => {
                        context.commit('injectParams', {target, newParams, reprocessCanvas})
                        
                        
                        var allYarns = context.getters.getAll()
                        var allYarnColors = []
                        allYarns.forEach( yarn => {

                            let activeValue  = yarn.params.value
                            let activeObject = yarn.params.options.filter(op => op.value == activeValue)
                            let activeColor  = activeObject[0].color
                
                            allYarnColors.push(hexToRgbA(activeColor))
                            
                        });

                        var allStructures = CONFIG.getStructuresConfig()
                        
                        context.dispatch('utils/updatePreview', {allYarnColors, allStructures}, {root:true})
                        
                    })
                    .then(()=> {
                        if (reprocessCanvas==true) {
                            context.dispatch('utils/reprocess', {}, {root:true})
                        }
                        resolve()  
                    })

                })

            },

        }
        
    }

}